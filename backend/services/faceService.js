export const calculateEuclideanDistance = (embedding1, embedding2) => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    return Number.POSITIVE_INFINITY
  }

  let sum = 0
  for (let i = 0; i < embedding1.length; i++) {
    sum += Math.pow(embedding1[i] - embedding2[i], 2)
  }

  return Math.sqrt(sum)
}

export const verifyFaceMatch = (templateEmbedding, capturedEmbedding, threshold = 0.6) => {
  const distance = calculateEuclideanDistance(templateEmbedding, capturedEmbedding)
  return {
    match: distance <= threshold,
    distance,
    threshold,
  }
}

export const findBestMatch = (capturedEmbedding, templates, threshold = 0.6) => {
  let bestMatch = null
  let minDistance = Number.POSITIVE_INFINITY

  for (const template of templates) {
    const distance = calculateEuclideanDistance(template.embedding, capturedEmbedding)

    if (distance < minDistance) {
      minDistance = distance
      bestMatch = template
    }
  }

  return {
    matched: minDistance <= threshold,
    distance: minDistance,
    template: bestMatch,
  }
}
