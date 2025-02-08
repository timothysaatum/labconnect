function deduceSampleStatus(sample) {
  const currentTime = new Date();
  const modifiedTime = new Date(sample.date_modified);
  const hoursDifference = Math.abs(currentTime - modifiedTime) / 36e5; // Convert milliseconds to hours

  // Check for "Rejected"
  if (sample.reject_sample) {
    return "Rejected";
  }

  // Check for "Processing"
  if (sample.collect_sample) {
    return "Processing";
  }
  // Default status
  return "Unknown";
}

