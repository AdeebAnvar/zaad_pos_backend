const express = require('express');
const router = express.Router();
const multer = require('multer');
const branchController = require('../controllers/branch_controllers');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({ storage });
router.post('/save_branch', upload.single('image'),branchController.saveBranch);
router.delete('/delete_branch',branchController.deleteBranch);
router.get('/getAllBranches',branchController.getAllBranches);
module.exports=router;