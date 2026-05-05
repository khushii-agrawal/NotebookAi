def chunk_fixed(text: str, size=500, overlap=50) -> list[str]:
    """Fixed-size character windowing."""
    chunks = []
    i = 0
    while i < len(text):
        chunks.append(text[i:i + size])
        i += size - overlap
    return chunks

def chunk_sentence_aware(text: str, max_chunk_size=500) -> list[str]:
    """Segmenting by sentences for better context coherence."""
    try:
        import nltk
        nltk.download('punkt', quiet=True)
        sentences = nltk.sent_tokenize(text)
    except:
        sentences = [s.strip() + '.' for s in text.split('. ') if s.strip()]

    chunks, current = [], ""
    for sentence in sentences:
        if len(current) + len(sentence) > max_chunk_size and current:
            chunks.append(current.strip())
            current = sentence
        else:
            current += " " + sentence
    if current.strip(): chunks.append(current.strip())
    return chunks

def chunk_paragraph(text: str) -> list[str]:
    """Splitting by natural document structure (double newlines)."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks, current = [], ""
    for para in paragraphs:
        if len(current) + len(para) < 600:
            current += "\n\n" + para
        else:
            if current.strip(): chunks.append(current.strip())
            current = para
    if current.strip(): chunks.append(current.strip())
    return chunks if chunks else [text[:500]]

CHUNKING_STRATEGIES = {
    "fixed-char-500": chunk_fixed,
    "sentence-aware": chunk_sentence_aware,
    "paragraph": chunk_paragraph,
}
