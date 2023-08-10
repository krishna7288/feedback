const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://krishna43835:NcSfWP4CX3KjocGn@cluster0.yoo4cyh.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

const feedbackSchema = new mongoose.Schema({
  courseName: String,
  selectedCourse: String,
  paperName: String,
  instructorName: String,
  studentName: String,
  batchNumber: String,
  ratings: {
    overallSatisfaction: Number,
    instructorKnowledge: Number,
    clarityOfMaterials: Number,
    relevanceOfTopics: Number,
    effectivenessOfExercises: Number,
    qualityOfEnvironment: Number,
    availabilityOfSupport: Number,
    instructorCommunication: Number,
    overallLearningExperience: Number,
  },
  courseExpectation: String,
  courseImprovement: String,
  additionalComments: String,
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submit-feedback', async (req, res) => {
  try {
    const newFeedback = new Feedback({
      courseName: req.body.courseName,
      selectedCourse: req.body.selectedCourse,
      paperName: req.body.paperName,
      instructorName: req.body.instructorName,
      studentName: req.body.studentName,
      batchNumber: req.body.batchNumber,
      ratings: {
        overallSatisfaction: req.body.ratings[0],
        instructorKnowledge: req.body.ratings[1],
        clarityOfMaterials: req.body.ratings[2],
        relevanceOfTopics: req.body.ratings[3],
        effectivenessOfExercises: req.body.ratings[4],
        qualityOfEnvironment: req.body.ratings[5],
        availabilityOfSupport: req.body.ratings[6],
        instructorCommunication: req.body.ratings[7],
        overallLearningExperience: req.body.ratings[8],
      },
      courseExpectation: req.body.courseExpectation,
      courseImprovement: req.body.courseImprovement,
      additionalComments: req.body.additionalComments,
    });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback.' });
  }
});

app.get('/get-feedback', async (req, res) => {
  try {
    const feedbackData = await Feedback.find();
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error('Error getting feedback data:', error);
    res.status(500).json({ message: 'Error getting feedback data.' });
  }
});

app.get('/get-feedback', async (req, res) => {
  try {
    const feedbackData = await Feedback.find();
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error('Error getting feedback data:', error);
    res.status(500).json({ message: 'Error getting feedback data.' });
  }
});

app.delete('/delete-feedback/:feedbackId', async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    await Feedback.findByIdAndDelete(feedbackId);
    res.status(200).json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback.' });
  }
});

app.get('/search-feedback', async (req, res) => {
  try {
    const studentName = req.query.studentName; // Get student name from query parameter
    const searchResults = await Feedback.find({
      studentName: { $regex: studentName, $options: 'i' }, // Case-insensitive search
    });
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching feedback:', error);
    res.status(500).json({ message: 'Error searching feedback.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
