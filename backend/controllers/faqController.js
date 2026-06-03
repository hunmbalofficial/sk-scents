const Faq = require('../models/Faq');

const getFaqs = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getFaqs, createFaq, updateFaq, deleteFaq };
