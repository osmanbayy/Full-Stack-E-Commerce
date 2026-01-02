import multer from "multer";
import os from "os";

// Use /tmp for Vercel, otherwise use system temp directory
const dest = process.env.VERCEL ? "/tmp" : os.tmpdir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanFileName = file.originalname.replace(/\s+/g, "_"); // Boşlukları temizler
    cb(null, uniqueSuffix + "-" + cleanFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

export default upload;
