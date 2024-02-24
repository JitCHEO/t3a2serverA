const express = require('express');
const { Form } = require('../models/FormModel');
const { getUserIdFromToken } = require('../utils/userAuthFunctions');

const router = express.Router();

//get forms for current user
router.get('/currentUser', async (request, response) => {
  try {
    const id = getUserIdFromToken(request.headers.jwt)
    const result = await Form.find({user: id, formTemplate: request.headers.formid})
                              .populate('user', '-_id fname lname')
                              .populate('formTemplate', '-_id assignedTo')
    if(!result){
      return response.status(404).json({message:"completed forms not found"});
  }
    return response.json({result: result})
  } catch (error) {
    return response.status(500).json({message: " Internal server error"})
  }
})

router.get("/:id", async(request, response) => {
  try{
      let result = await User.findById(request.params.id);
      if(!result){
          return response.status(404).json({message:"User not found"});
      }
      return response.json({result});
  }catch(error){
      return response.status(500).json({message: " Internal server error"});
  }
})


router.post('/submit', async (request, response) => {
  
  try {

    const { description,formTemplate, formData } = request.body;

    const id = getUserIdFromToken(request.headers.jwt)

      let newForm = await Form.create({
          description: description,
          formTemplate: formTemplate,
          formData: formData,
          user: id
      })

      response.status(201).json({
          newForm: newForm
      })
  } catch (error) {
      response.status(500).json({error: error.message})
  }
})

// GET request handler to fetch a form template by name
router.get('/:formName', async (req, res) => {
  const formName = req.params.formName;

  try {
      // Find the form template by name in your database
      const formTemplate = await Form.findOne({ name: formName });
      if (!formTemplate) {
          return res.status(404).json({ error: 'Form template not found' });
      }

      res.json({ formTemplate });
  } catch (error) {
      console.error('Error fetching form template:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
