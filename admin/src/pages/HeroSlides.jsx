import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { X, Pencil, Plus, Trash2 } from "lucide-react";
import { assets } from "../assets/assets";

// eslint-disable-next-line react/prop-types
const HeroSlides = ({ token }) => {
  const [slides, setSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [image, setImage] = useState(false);
  const [existingImage, setExistingImage] = useState("");

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleTr, setTitleTr] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [subtitleTr, setSubtitleTr] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonTextEn, setButtonTextEn] = useState("");
  const [buttonTextTr, setButtonTextTr] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const fetchSlides = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/hero-slide/list-all", {
        headers: { token },
      });

      if (response.data.success) {
        setSlides(response.data.slides);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDeleteClick = (id) => {
    setSlideToDelete(id);
    setShowDeleteModal(true);
  };

  const removeSlide = async () => {
    if (!slideToDelete) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/hero-slide/remove",
        { id: slideToDelete },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSlides();
        setShowDeleteModal(false);
        setSlideToDelete(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    resetForm();
  };

  const openUpdateModal = (slide) => {
    setSelectedSlide(slide);
    setTitle(slide.title || "");
    setTitleEn(slide.titleEn || slide.title || "");
    setTitleTr(slide.titleTr || slide.title || "");
    setSubtitle(slide.subtitle || "");
    setSubtitleEn(slide.subtitleEn || slide.subtitle || "");
    setSubtitleTr(slide.subtitleTr || slide.subtitle || "");
    setButtonText(slide.buttonText || "");
    setButtonTextEn(slide.buttonTextEn || slide.buttonText || "");
    setButtonTextTr(slide.buttonTextTr || slide.buttonText || "");
    setOrder(slide.order?.toString() || "0");
    setIsActive(slide.isActive !== undefined ? slide.isActive : true);
    setExistingImage(slide.image || "");
    setImage(false);
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedSlide(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setTitleEn("");
    setTitleTr("");
    setSubtitle("");
    setSubtitleEn("");
    setSubtitleTr("");
    setButtonText("");
    setButtonTextEn("");
    setButtonTextTr("");
    setOrder("0");
    setIsActive(true);
    setImage(false);
    setExistingImage("");
  };

  const addSlide = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title || titleEn || titleTr);
      formData.append("titleEn", titleEn || title);
      formData.append("titleTr", titleTr || title);
      formData.append("subtitle", subtitle || subtitleEn || subtitleTr);
      formData.append("subtitleEn", subtitleEn || subtitle);
      formData.append("subtitleTr", subtitleTr || subtitle);
      formData.append("buttonText", buttonText || buttonTextEn || buttonTextTr);
      formData.append("buttonTextEn", buttonTextEn || buttonText);
      formData.append("buttonTextTr", buttonTextTr || buttonText);
      formData.append("order", order);
      formData.append("isActive", isActive);
      formData.append("image", image);

      const response = await axios.post(
        backendUrl + "/api/hero-slide/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSlides();
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateSlide = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", selectedSlide._id);
      formData.append("title", title || titleEn || titleTr);
      formData.append("titleEn", titleEn || title);
      formData.append("titleTr", titleTr || title);
      formData.append("subtitle", subtitle || subtitleEn || subtitleTr);
      formData.append("subtitleEn", subtitleEn || subtitle);
      formData.append("subtitleTr", subtitleTr || subtitle);
      formData.append("buttonText", buttonText || buttonTextEn || buttonTextTr);
      formData.append("buttonTextEn", buttonTextEn || buttonText);
      formData.append("buttonTextTr", buttonTextTr || buttonText);
      formData.append("order", order);
      formData.append("isActive", isActive);

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        backendUrl + "/api/hero-slide/update",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSlides();
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">Hero Slides Management</p>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {slides.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No slides found. Add your first slide!</p>
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{slide.title}</h3>
                    {!slide.isActive && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        Inactive
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                      Order: {slide.order}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Subtitle:</strong> {slide.subtitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Button:</strong> {slide.buttonText}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openUpdateModal(slide)}
                    className="p-2 text-blue-600 transition-colors hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="Update Slide"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(slide._id)}
                    className="p-2 text-red-600 transition-colors hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Hero Slide</h2>
              <button
                onClick={closeModal}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={addSlide} className="flex flex-col items-start w-full gap-3 p-6">
              <div className="w-full">
                <p className="mb-2">Upload Image *</p>
                <label className="cursor-pointer">
                  <img
                    className="w-48 h-32 object-cover border rounded"
                    src={!image ? assets.upload_area : URL.createObjectURL(image)}
                    alt=""
                  />
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    accept="image/*"
                    hidden
                    required
                  />
                </label>
              </div>

              <div className="w-full">
                <p className="mb-2">Title (Fallback - Optional)</p>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Title (English) *</p>
                <input
                  onChange={(e) => setTitleEn(e.target.value)}
                  value={titleEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Title Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Title (Turkish) *</p>
                <input
                  onChange={(e) => setTitleTr(e.target.value)}
                  value={titleTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe Başlık Buraya..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Subtitle (Fallback - Optional)</p>
                <input
                  onChange={(e) => setSubtitle(e.target.value)}
                  value={subtitle}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Subtitle (English) *</p>
                <input
                  onChange={(e) => setSubtitleEn(e.target.value)}
                  value={subtitleEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Subtitle Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Subtitle (Turkish) *</p>
                <input
                  onChange={(e) => setSubtitleTr(e.target.value)}
                  value={subtitleTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe Alt Başlık Buraya..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Button Text (Fallback - Optional)</p>
                <input
                  onChange={(e) => setButtonText(e.target.value)}
                  value={buttonText}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Button Text (English) *</p>
                <input
                  onChange={(e) => setButtonTextEn(e.target.value)}
                  value={buttonTextEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Button Text Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Button Text (Turkish) *</p>
                <input
                  onChange={(e) => setButtonTextTr(e.target.value)}
                  value={buttonTextTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe Buton Metni Buraya..."
                  required
                />
              </div>

              <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
                <div>
                  <p className="mb-2">Display Order</p>
                  <input
                    onChange={(e) => setOrder(e.target.value)}
                    value={order}
                    className="w-full px-3 py-2 sm:w-[120px]"
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <input
                    onChange={() => setIsActive((prev) => !prev)}
                    checked={isActive}
                    type="checkbox"
                    id="isActive"
                  />
                  <label className="cursor-pointer" htmlFor="isActive">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="py-3 text-white transition-all bg-blue-600 rounded-lg w-28 hover:bg-blue-700"
                >
                  ADD
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-3 text-white transition-all bg-gray-500 rounded-lg w-28 hover:bg-gray-600"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Update Hero Slide</h2>
              <button
                onClick={closeModal}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={updateSlide}
              className="flex flex-col items-start w-full gap-3 p-6"
            >
              <div className="w-full">
                <p className="mb-2">Current Image</p>
                <img
                  src={existingImage}
                  alt="Current"
                  className="w-48 h-32 object-cover border rounded mb-2"
                />
                <p className="mb-2">Upload New Image (Optional)</p>
                <label className="cursor-pointer">
                  <img
                    className="w-48 h-32 object-cover border rounded"
                    src={!image ? assets.upload_area : URL.createObjectURL(image)}
                    alt=""
                  />
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>

              <div className="w-full">
                <p className="mb-2">Title (Fallback - Optional)</p>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Title (English) *</p>
                <input
                  onChange={(e) => setTitleEn(e.target.value)}
                  value={titleEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Title Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Title (Turkish) *</p>
                <input
                  onChange={(e) => setTitleTr(e.target.value)}
                  value={titleTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe Başlık Buraya..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Subtitle (Fallback - Optional)</p>
                <input
                  onChange={(e) => setSubtitle(e.target.value)}
                  value={subtitle}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Subtitle (English) *</p>
                <input
                  onChange={(e) => setSubtitleEn(e.target.value)}
                  value={subtitleEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Subtitle Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Subtitle (Turkish) *</p>
                <input
                  onChange={(e) => setSubtitleTr(e.target.value)}
                  value={subtitleTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe Alt Başlık Buraya..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Button Text (Fallback - Optional)</p>
                <input
                  onChange={(e) => setButtonText(e.target.value)}
                  value={buttonText}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Button Text (English) *</p>
                <input
                  onChange={(e) => setButtonTextEn(e.target.value)}
                  value={buttonTextEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Button Text Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Button Text (Turkish) *</p>
                <input
                  onChange={(e) => setButtonTextTr(e.target.value)}
                  value={buttonTextTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe Buton Metni Buraya..."
                  required
                />
              </div>

              <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
                <div>
                  <p className="mb-2">Display Order</p>
                  <input
                    onChange={(e) => setOrder(e.target.value)}
                    value={order}
                    className="w-full px-3 py-2 sm:w-[120px]"
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <input
                    onChange={() => setIsActive((prev) => !prev)}
                    checked={isActive}
                    type="checkbox"
                    id="update-isActive"
                  />
                  <label className="cursor-pointer" htmlFor="update-isActive">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="py-3 text-white transition-all bg-blue-600 rounded-lg w-28 hover:bg-blue-700"
                >
                  UPDATE
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-3 text-white transition-all bg-gray-500 rounded-lg w-28 hover:bg-gray-600"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Confirm Delete</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSlideToDelete(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this slide? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSlideToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={removeSlide}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSlides;

