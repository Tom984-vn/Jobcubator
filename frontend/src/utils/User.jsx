import API from "../api";
export async function UpdateUserProfile(data, accessToken) {
  const response = await API.put("/user/me", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
export async function uploadAvatar(file, accessToken) {
  try {
    const formData = new FormData();
    formData.append("file", file); // Must match @RequestParam("file") on backend

    const response = await API.post("/upload/avatar/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // This will have objectKey, avatarUrl, message
  } catch (error) {
    console.error("Error uploading avatar:", error);

    if (error.response) {
      // Backend returned an error
      throw new Error(error.response.data.message || "Failed to upload avatar");
    } else {
      // Network or other error
      throw new Error("Network error: Unable to upload avatar");
    }
  }
}
export async function updateAvatarUrl(objectKey, accessToken) {
  const response = await API.put(
    "/user/me/avatar",
    objectKey, // << plain string, NOT an object
    {
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}
export async function getUserAvatarUrl(accessToken) {
  const response = await API.get(`/upload/avatar`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
