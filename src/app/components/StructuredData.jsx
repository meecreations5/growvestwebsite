function serializeStructuredData(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData({ data, id }) {
  if (!data) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
