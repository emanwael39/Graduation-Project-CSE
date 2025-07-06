// const multer = require("multer");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const taskStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './imageAndPdfCorrect/pdfSavingForAnswerModel');
//     },
//     filename: function (req, file, cb) {
//         if (file) {
//             console.log(file.originalname);
//             const fileExt = path.extname(file.originalname); // الحصول على الامتداد
//             const authParam = req.query.auth; // الحصول على قيمة auth من الـ URL
//             if (authParam) {
//                 // إذا كانت قيمة auth موجودة، استخدمها كاسم للملف
//                 cb(null, `${authParam}${fileExt}`);
//             } else {
//                 // إذا لم تكن موجودة، استخدم UUID مع الامتداد
//                 cb(null, uuidv4() + fileExt);
//             }
//         } else {
//             cb(null, false);
//         }
//     }
// });

// const imageuploadForAnswerModel = multer({
//     storage: taskStorage,
//     fileFilter: (req, file, cb) => {
//         const fileExt = path.extname(file.originalname).toLowerCase(); // الحصول على الامتداد وتحويله لحروف صغيرة
//         const isPDF = file.mimetype === "application/pdf" && fileExt === ".pdf"; // التحقق من أن الملف PDF
//         console.log("isPDF:", isPDF); // طباعة نتيجة التحقق

//         if (isPDF) {
//             cb(null, true);
//         } else {
//             cb("Unsupported file type. Only PDF files are allowed.", false);
//         }
//     },
//     limits: { fileSize: 1024 * 1024 * 100 } // الحد الأقصى لحجم الملف 100 ميجابايت
// });

// module.exports = { imageuploadForAnswerModel };

const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// إعداد التخزين باستخدام `multer`
const taskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageAndPdfCorrect/pdfSavingForAnswerModel'); // المجلد الذي سيتم حفظ الملفات فيه
    },
    filename: function (req, file, cb) {
        if (file) {
            console.log("Received file:", file.originalname); // طباعة اسم الملف الأصلي
            const fileExt = path.extname(file.originalname); // استخراج الامتداد
            const authParam = req.query.auth; // قراءة `auth` من الـ URL

            if (authParam) {
                cb(null, `${authParam}${fileExt}`); // استخدام `authParam` كاسم للملف
            } else {
                cb(null, uuidv4() + fileExt); // اسم عشوائي في حال عدم وجود `authParam`
            }
        } else {
            cb(new Error("No file received"), false);
        }
    }
});

// إعداد `multer` بدون أي فلاتر (يقبل أي نوع ملف)
const imageuploadForAnswerModel = multer({
    storage: taskStorage,
    limits: { fileSize: 1024 * 1024 * 100 }, // الحد الأقصى للحجم 100MB
});

// تصدير `multer`
module.exports = { imageuploadForAnswerModel };
