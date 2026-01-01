import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameTr, setNameTr] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [productType, setProductType] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name || nameEn || nameTr); // Fallback for backward compatibility
      formData.append("nameEn", nameEn || name);
      formData.append("nameTr", nameTr || name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("productType", productType);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      //Emptying the inputs after adding the product
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setNameEn("");
        setNameTr("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
      }else{
        toast.error(response.data.message);  
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start w-full gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label className="cursor-pointer" htmlFor="image1">
            <img
              className="w-24"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label className="cursor-pointer" htmlFor="image2">
            <img
              className="w-24"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label className="cursor-pointer" htmlFor="image3">
            <img
              className="w-24"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label className="cursor-pointer" htmlFor="image4">
            <img
              className="w-24"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name (Fallback - Optional)</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 mb-3"
          type="text"
          placeholder="Type Here... (Will be used if nameEn/nameTr not provided)"
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
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2 resize-none"
          type="text"
          placeholder="Write Content Here..."
          required
        />
      </div>

      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
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
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("S")
                  ? prev.filter((item) => item !== "S")
                  : [...prev, "S"]
              )
            }
          >
            <p
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes("S") ? "bg-slate-400" : "bg-pink-100"
              }`}
            >
              S
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("M")
                  ? prev.filter((item) => item !== "M")
                  : [...prev, "M"]
              )
            }
          >
            <p
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes("M") ? "bg-slate-400" : "bg-pink-100"
              }`}
            >
              M
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("L")
                  ? prev.filter((item) => item !== "L")
                  : [...prev, "L"]
              )
            }
          >
            <p
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes("L") ? "bg-slate-400" : "bg-pink-100"
              }`}
            >
              L
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XL")
                  ? prev.filter((item) => item !== "XL")
                  : [...prev, "XL"]
              )
            }
          >
            <p
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes("XL") ? "bg-slate-400" : "bg-pink-100"
              }`}
            >
              XL
            </p>
          </div>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes("XXL")
                  ? prev.filter((item) => item !== "XXL")
                  : [...prev, "XXL"]
              )
            }
          >
            <p
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes("XXL") ? "bg-slate-400" : "bg-pink-100"
              }`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>
      <button
        type="submit"
        className="py-3 mt-4 text-white transition-all bg-black rounded-lg w-28 hover:tracking-widest"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
