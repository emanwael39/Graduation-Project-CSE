const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const taskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageQuestions'); // تحديد مجلد حفظ الصور
    },
    filename: function (req, file, cb) {
        if (file) {
            console.log(file.originalname);
            const fileExt = path.extname(file.originalname); // الحصول على الامتداد
            const authParam = req.query.auth; // الحصول على قيمة auth من الـ URL
            if (authParam) {
                // إذا كانت قيمة auth موجودة، استخدمها كاسم للملف
                cb(null, `${authParam}${fileExt}`);
            } else {
                // إذا لم تكن موجودة، استخدم UUID مع الامتداد
                cb(null, uuidv4() + fileExt);
            }
        } else {
            cb(null, false);
        }
    }
});

const imageuploadForQuestions = multer({
    storage: taskStorage,
    fileFilter: (req, file, cb) => {
        // التحقق من نوع الملف إذا كان صورة
        const fileExt = path.extname(file.originalname).toLowerCase(); // الحصول على الامتداد وتحويله لحروف صغيرة
        const allowedImageTypes = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"]; // أنواع الصور المسموح بها

        // التحقق إذا كان الامتداد ضمن الأنواع المسموح بها
        if (allowedImageTypes.includes(fileExt)) {
            cb(null, true); // السماح برفع الصورة
        } else {
            cb("Unsupported file type. Only image files are allowed.", false); // رفض الملفات غير المدعومة
        }
    },
    limits: { fileSize: 1024 * 1024 * 100 } // الحد الأقصى لحجم الملف 100 ميجابايت
});

module.exports = { imageuploadForQuestions };
