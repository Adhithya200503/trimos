

const UrlList = ({ urls }) => {
  if (urls.length === 0)
    return <p className="text-gray-500 mt-4">No URLs found.</p>;

  return (
    <div className="mt-4">
      {urls.map((url) => (
        <div
          key={url._id}
          className="border p-3 rounded mb-2 bg-gray-50 flex justify-between"
        >
          <div>
            <p>
              <b>Slug:</b> {url.slugName}
            </p>
            <p>
              <b>Destination:</b>{" "}
              <a href={url.destinationUrl} target="_blank" rel="noreferrer">
                {url.destinationUrl}
              </a>
            </p>
            <p>
              <b>Tags:</b> {url.tags.join(", ")}
            </p>
          </div>
          <a
            href={url.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            Visit
          </a>
        </div>
      ))}
    </div>
  );
};

export default UrlList;
