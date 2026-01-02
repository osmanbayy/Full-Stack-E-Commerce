import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { backendUrl, currency } from "../App";
import toast from "react-hot-toast";
import { X, Pencil } from "lucide-react";
import { assets } from "../assets/assets";

// eslint-disable-next-line react/prop-types
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameTr, setNameTr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionTr, setDescriptionTr] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [productType, setProductType] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [discount, setDiscount] = useState("0");

  const fetchList = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");

      const response = await axios.get(`${backendUrl}/api/product/list?${params.toString()}`);

      if (response.data.success) {
        const products = response.data.products;
        
        if (append) {
          setList(prev => [...prev, ...products]);
        } else {
          setList(products);
        }

        setHasMore(response.data.pagination?.hasMore || false);
        setCurrentPage(page);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [backendUrl]);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const removeProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: productToDelete },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Remove deleted product from list
        setList(prev => prev.filter(item => item._id !== productToDelete));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openUpdateModal = async (product) => {
    setSelectedProduct(product);
    setName(product.name || "");
    setNameEn(product.nameEn || product.name || "");
    setNameTr(product.nameTr || product.name || "");
    setDescription(product.description || "");
    setDescriptionEn(product.descriptionEn || product.description || "");
    setDescriptionTr(product.descriptionTr || product.description || "");
    setPrice(product.price?.toString() || "");
    setCategory(product.category || "Men");
    setSubCategory(product.subCategory || "Topwear");
    setProductType(product.productType || "");
    setBestseller(product.bestseller || false);
    setDiscount(product.discount?.toString() || "0");
    setSizes(product.sizes || []);
    setExistingImages(product.image || []);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
    setName("");
    setNameEn("");
    setNameTr("");
    setDescription("");
    setDescriptionEn("");
    setDescriptionTr("");
    setPrice("");
    setCategory("Men");
    setSubCategory("Topwear");
    setProductType("");
    setBestseller(false);
    setDiscount("0");
    setSizes([]);
    setExistingImages([]);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", selectedProduct._id);
      formData.append("name", name || nameEn || nameTr);
      formData.append("nameEn", nameEn || name);
      formData.append("nameTr", nameTr || name);
      formData.append("description", description || descriptionEn || descriptionTr);
      formData.append("descriptionEn", descriptionEn || description);
      formData.append("descriptionTr", descriptionTr || description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("productType", productType);
      formData.append("bestseller", bestseller);
      formData.append("discount", discount);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("existingImages", JSON.stringify(existingImages));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/update",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh current page
        await fetchList(currentPage, false);
        closeUpdateModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList(1, false);
  }, [fetchList]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          fetchList(currentPage + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, currentPage, fetchList]);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* ------------ List Table Title-------------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ---------- Product List ----------- */}
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] border items-center gap-2 py-1 px-2 text-sm animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="hidden md:block h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="hidden md:block h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="flex items-center justify-end gap-3 md:justify-center">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : list.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            {list.map((item, index) => (
              <div
                className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] border items-center gap-2 py-1 px-2 text-sm hover:bg-slate-100"
                key={item._id || index}
              >
                <img className="w-16" src={item.image[0]} alt="" />
                <p className="font-semibold">{item.name}</p>
                <p className="hidden md:block">{item.category}</p>
                <p className="hidden md:block">
                  {currency}
                  {item.price}
                </p>
                <div className="flex items-center justify-end gap-3 md:justify-center">
                  <button
                    onClick={() => openUpdateModal(item)}
                    className="p-1 text-blue-600 transition-colors hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="Update Product"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-1 text-red-600 transition-colors hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete Product"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
              {isLoadingMore && (
                <div className="flex flex-col gap-2 w-full">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] border items-center gap-2 py-1 px-2 text-sm animate-pulse"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="hidden md:block h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="hidden md:block h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="flex items-center justify-end gap-3 md:justify-center">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Update Product</h2>
              <button
                onClick={closeUpdateModal}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={updateProduct}
              className="flex flex-col items-start w-full gap-3 p-6"
            >
              <div>
                <p className="mb-2">Upload New Images (Optional)</p>
                <div className="flex gap-2">
                  <label className="cursor-pointer" htmlFor="update-image1">
                    <img
                      className="w-24"
                      src={
                        !image1
                          ? assets.upload_area
                          : URL.createObjectURL(image1)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage1(e.target.files[0])}
                      type="file"
                      id="update-image1"
                      hidden
                    />
                  </label>
                  <label className="cursor-pointer" htmlFor="update-image2">
                    <img
                      className="w-24"
                      src={
                        !image2
                          ? assets.upload_area
                          : URL.createObjectURL(image2)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage2(e.target.files[0])}
                      type="file"
                      id="update-image2"
                      hidden
                    />
                  </label>
                  <label className="cursor-pointer" htmlFor="update-image3">
                    <img
                      className="w-24"
                      src={
                        !image3
                          ? assets.upload_area
                          : URL.createObjectURL(image3)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage3(e.target.files[0])}
                      type="file"
                      id="update-image3"
                      hidden
                    />
                  </label>
                  <label className="cursor-pointer" htmlFor="update-image4">
                    <img
                      className="w-24"
                      src={
                        !image4
                          ? assets.upload_area
                          : URL.createObjectURL(image4)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage4(e.target.files[0])}
                      type="file"
                      id="update-image4"
                      hidden
                    />
                  </label>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div>
                  <p className="mb-2">Existing Images (Click to remove)</p>
                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          className="w-24 h-24 object-cover border rounded cursor-pointer hover:opacity-75"
                          src={img}
                          alt={`Existing ${idx + 1}`}
                          onClick={() => removeExistingImage(idx)}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full">
                <p className="mb-2">Product Name (Fallback - Optional)</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full max-w-[500px] px-3 py-2 mb-3"
                  type="text"
                  placeholder="Type Here..."
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Product Name (English) *</p>
                <input
                  onChange={(e) => setNameEn(e.target.value)}
                  value={nameEn}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Type English Name Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Product Name (Turkish) *</p>
                <input
                  onChange={(e) => setNameTr(e.target.value)}
                  value={nameTr}
                  className="w-full max-w-[500px] px-3 py-2"
                  type="text"
                  placeholder="Türkçe İsim Buraya..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Product Description (Fallback - Optional)</p>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="w-full max-w-[500px] px-3 py-2 resize-none"
                  type="text"
                  placeholder="Write Content Here... (Will be used if descriptionEn/descriptionTr not provided)"
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Product Description (English) *</p>
                <textarea
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  value={descriptionEn}
                  className="w-full max-w-[500px] px-3 py-2 resize-none"
                  type="text"
                  placeholder="Write English Description Here..."
                  required
                />
              </div>

              <div className="w-full">
                <p className="mb-2">Product Description (Turkish) *</p>
                <textarea
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  value={descriptionTr}
                  className="w-full max-w-[500px] px-3 py-2 resize-none"
                  type="text"
                  placeholder="Türkçe Açıklama Buraya..."
                  required
                />
              </div>

              <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
                <div>
                  <p className="mb-2">Product Category</p>
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className="w-full px-3 py-2"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2">Sub Category</p>
                  <select
                    onChange={(e) => setSubCategory(e.target.value)}
                    value={subCategory}
                    className="w-full px-3 py-2"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2">Product Type</p>
                  <select
                    onChange={(e) => setProductType(e.target.value)}
                    value={productType}
                    className="w-full px-3 py-2"
                  >
                    <option value="">Select Product Type</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Sweater">Sweater</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Pants">Pants</option>
                    <option value="Dress">Dress</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Hoodie">Hoodie</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Skirt">Skirt</option>
                    <option value="Coat">Coat</option>
                    <option value="Boots">Boots</option>
                    <option value="Sneakers">Sneakers</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2">Product Price</p>
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    className="w-full px-3 py-2 sm:w-[120px]"
                    type="number"
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <p className="mb-2">Discount (%)</p>
                  <input
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                    className="w-full px-3 py-2 sm:w-[120px]"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2">Product Sizes</p>
                <div className="flex gap-3">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div
                      key={size}
                      onClick={() =>
                        setSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((item) => item !== size)
                            : [...prev, size]
                        )
                      }
                    >
                      <p
                        className={`px-3 py-1 cursor-pointer ${
                          sizes.includes(size)
                            ? "bg-slate-400"
                            : "bg-pink-100"
                        }`}
                      >
                        {size}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  onChange={() => setBestseller((prev) => !prev)}
                  checked={bestseller}
                  type="checkbox"
                  id="update-bestseller"
                />
                <label className="cursor-pointer" htmlFor="update-bestseller">
                  Add to Bestseller
                </label>
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
                  onClick={closeUpdateModal}
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
                  setProductToDelete(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={removeProduct}
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

export default List;
