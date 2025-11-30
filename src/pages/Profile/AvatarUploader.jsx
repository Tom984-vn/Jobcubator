import { useEffect, useState } from "react";
import { FiCamera } from "react-icons/fi"; // Make sure to install react-icons
import { uploadAvatar } from "../../utils/User";
import { updateAvatarUrl } from "../../utils/User";
import { getUserAvatarUrl } from "../../utils/User";
function AvatarUploader({ userProfile, accessToken, onAvatarChange }) {
  const [avatarUrl, setAvatarUrl] = useState("images/defaultAvatar.jpg");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const data = await getUserAvatarUrl(accessToken);
        if (data) {
          setAvatarUrl(data);
        }
      } catch (error) {
        console.error("Error fetching avatar URL:", error);
      }
    };
    fetchAvatar();
  }, [accessToken]);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await uploadAvatar(file, accessToken); // returns objectKey + presigned URL
      const objectKey = response.objectKey;

      await updateAvatarUrl(objectKey, accessToken); // send only objectKey to backend

      const avatarUrl = response.avatarUrl; // presigned URL for immediate display
      setAvatarUrl(avatarUrl);
      if (onAvatarChange) onAvatarChange(avatarUrl);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="relative w-20 h-20 rounded overflow-hidden cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => document.getElementById("avatarInput").click()}
    >
      {/* Avatar Image */}
      <img
        src={avatarUrl}
        alt="Avatar"
        className="h-20 w-20 rounded object-cover"
      />

      {/* Hover Overlay */}
      {hover && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
          <FiCamera className="text-white text-2xl" />
        </div>
      )}

      {/* Upload Input */}
      <input
        type="file"
        id="avatarInput"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
          <span className="text-white text-sm">Uploading...</span>
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;
