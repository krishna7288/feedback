const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://krishna43835:NcSfWP4CX3KjocGn@cluster0.yoo4cyh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a schema for feedback data
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedbackType: String,
  comments: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submit-feedback', async (req, res) => {
  const formData = req.body;

  try {
    const feedback = new Feedback(formData);
    await feedback.save();
    console.log('Feedback saved:', feedback);
    res.status(200).send('Feedback received and stored successfully');
  } catch (error) {
    console.error('Error storing feedback:', error);
    res.status(500).send('Internal server error');
  }
});


// ... Other imports and code

// Endpoint to fetch feedback data
app.get('/get-feedback', async (req, res) => {
  try {
    const feedbackData = await Feedback.find(); // Retrieve all feedback documents
    res.json(feedbackData);
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    res.status(500).send('Internal server error');
  }
});

// ... Other routes and code

// ... Other imports and code ...

// Endpoint to delete feedback by ID
app.delete('/delete-feedback/:id', async (req, res) => {
  const feedbackId = req.params.id;

  try {
    await Feedback.findByIdAndDelete(feedbackId);
    console.log('Feedback deleted:', feedbackId);
    res.status(200).send('Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).send('Internal server error');
  }
});

// ... Other routes and code ...



const PORT = 4000; // You can change this to your desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
