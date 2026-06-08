
from __future__ import annotations

import json
import os
import statistics
import sys
from pathlib import Path
from typing import Dict, List

import httpx
from openai import OpenAI


# ---------------------------------------------------------
# Evaluation dataset path
# ---------------------------------------------------------
DATASET_PATH = Path("eval/golden_dataset.json")


# ---------------------------------------------------------
# Backend API endpoint
# ---------------------------------------------------------
API_URL = os.getenv(
    "EVAL_API_URL",
    "http://localhost:8000/ask",
)


# ---------------------------------------------------------
# OpenAI client
# ---------------------------------------------------------
openai_client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# ---------------------------------------------------------
# Embedding model for relevance scoring
# ---------------------------------------------------------
EMBEDDING_MODEL = "text-embedding-3-small"


# ---------------------------------------------------------
# Metric thresholds
# ---------------------------------------------------------
MIN_FAITHFULNESS = 0.8
MIN_RELEVANCE = 0.7
MIN_CITATION_RECALL = 0.9


# ---------------------------------------------------------
# Load golden evaluation dataset
# ---------------------------------------------------------
def load_dataset() -> List[Dict]:
    """
    Loads evaluation benchmark dataset.
    """

    with open(DATASET_PATH, "r") as file:
        return json.load(file)


# ---------------------------------------------------------
# Call RAG API
# ---------------------------------------------------------
async def ask_question(
    client: httpx.AsyncClient,
    question: str,
) -> Dict:
    """
    Sends question to RAG backend.
    """

    response = await client.post(
        API_URL,
        json={
            "question": question,
            "top_k": 5,
        },
        timeout=60,
    )

    response.raise_for_status()

    return response.json()


# ---------------------------------------------------------
# Compute cosine similarity manually
# ---------------------------------------------------------
def cosine_similarity(
    vec1: List[float],
    vec2: List[float],
) -> float:
    """
    Computes cosine similarity between vectors.
    """

    dot_product = sum(a * b for a, b in zip(vec1, vec2))

    magnitude_1 = sum(a * a for a in vec1) ** 0.5
    magnitude_2 = sum(b * b for b in vec2) ** 0.5

    return dot_product / (magnitude_1 * magnitude_2)


# ---------------------------------------------------------
# Generate embedding
# ---------------------------------------------------------
def embed_text(text: str) -> List[float]:
    """
    Generates embedding vector for text.
    """

    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )

    return response.data[0].embedding


# ---------------------------------------------------------
# LLM-as-a-judge faithfulness evaluation
# ---------------------------------------------------------
def evaluate_faithfulness(
    question: str,
    answer: str,
    citations: List[str],
) -> int:
    """
    Uses GPT model to judge answer faithfulness.

    Returns:
        1 -> grounded
        0 -> hallucinated
    """

    prompt = f"""
You are evaluating a RAG system answer.

Question:
{question}

Answer:
{answer}

Citations:
{citations}

Task:
Return ONLY:
1 -> if answer appears supported by citations
0 -> if answer appears hallucinated or unsupported
""".strip()

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",

        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],

        temperature=0,
    )

    result = response.choices[0].message.content.strip()

    return 1 if result == "1" else 0


# ---------------------------------------------------------
# Citation recall metric
# ---------------------------------------------------------
def citation_recall(
    expected_doc_ids: List[str],
    returned_citations: List[str],
) -> float:
    """
    Computes citation recall score.

    Formula:
        matched / expected
    """

    expected = set(expected_doc_ids)
    returned = set(returned_citations)

    matched = expected.intersection(returned)

    return len(matched) / len(expected)


# ---------------------------------------------------------
# Main evaluation runner
# ---------------------------------------------------------
async def run_evaluation():
    """
    Executes full evaluation benchmark.
    """

    dataset = load_dataset()

    faithfulness_scores = []
    relevance_scores = []
    citation_scores = []

    async with httpx.AsyncClient() as client:

        for sample in dataset:

            question = sample["question"]

            expected_answer = sample["expected_answer"]

            expected_doc_ids = sample["source_doc_ids"]

            # ---------------------------------------------
            # Call RAG API
            # ---------------------------------------------
            result = await ask_question(
                client=client,
                question=question,
            )

            answer = result["answer"]

            citations = result["citations"]

            # ---------------------------------------------
            # Faithfulness
            # ---------------------------------------------
            faithfulness = evaluate_faithfulness(
                question=question,
                answer=answer,
                citations=citations,
            )

            faithfulness_scores.append(faithfulness)

            # ---------------------------------------------
            # Answer relevance
            # ---------------------------------------------
            question_embedding = embed_text(question)

            answer_embedding = embed_text(answer)

            relevance = cosine_similarity(
                question_embedding,
                answer_embedding,
            )

            relevance_scores.append(relevance)

            # ---------------------------------------------
            # Citation recall
            # ---------------------------------------------
            citation_score = citation_recall(
                expected_doc_ids=expected_doc_ids,
                returned_citations=citations,
            )

            citation_scores.append(citation_score)

    # -----------------------------------------------------
    # Aggregate metrics
    # -----------------------------------------------------
    avg_faithfulness = statistics.mean(
        faithfulness_scores
    )

    avg_relevance = statistics.mean(
        relevance_scores
    )

    avg_citation_recall = statistics.mean(
        citation_scores
    )

    # -----------------------------------------------------
    # Print evaluation summary
    # -----------------------------------------------------
    print("\n========== RAG Evaluation ==========")

    print(
        f"Faithfulness     : {avg_faithfulness:.3f}"
    )

    print(
        f"Answer Relevance : {avg_relevance:.3f}"
    )

    print(
        f"Citation Recall  : {avg_citation_recall:.3f}"
    )

    print("====================================\n")

    # -----------------------------------------------------
    # Fail CI if thresholds are not met
    # -----------------------------------------------------
    if (
        avg_faithfulness < MIN_FAITHFULNESS
        or avg_relevance < MIN_RELEVANCE
        or avg_citation_recall < MIN_CITATION_RECALL
    ):
        print("Evaluation thresholds failed.")

        sys.exit(1)

    print("Evaluation passed.")


# ---------------------------------------------------------
# Entry point
# ---------------------------------------------------------
if __name__ == "__main__":

    import asyncio

    asyncio.run(run_evaluation())
