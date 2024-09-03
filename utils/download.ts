export function forceDownload(blobUrl: string, filename: string) {
    let a = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  
  export default function downloadStr(url: string, filename: string) {
    fetch(url, {
      headers: new Headers({
        Origin: location.origin,
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
        URL.revokeObjectURL(blobUrl); // Clean up
      })
      .catch((e) => console.error(e));
  }
  