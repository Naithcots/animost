import qs from "query-string";

type GetLibraryEntryParams = {
  jikanMediaId: string;
};

export default async function getLibraryEntry({
  jikanMediaId,
}: GetLibraryEntryParams) {
  const url = qs.stringifyUrl({
    url: "/api/library",
    query: { mediaId: jikanMediaId },
  });

  const response = await fetch(url);
  return await response.json();
}
