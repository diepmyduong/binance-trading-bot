export async function importFile(
  promise: () => Promise<any>,
  fileType: "excel",
  fileName: string,
  toast?: any
) {
  let type;

  switch (fileType) {
    case "excel":
      type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    default:
      break;
  }

  try {
    let res = await promise();
    // let blob = new Blob([res], {
    //   type,
    // });
    // saveAs(blob, fileName);
  } catch (err) {
    console.error(err);
    if (toast) toast.error(`Import thất bại. ${err.message}`);
  }
}
