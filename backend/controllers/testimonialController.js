const Testimonial = require('../models/Testimonial');

const seedTestimonials = async () => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany([
        { name: 'Isabella Rossi', role: 'Fragrance Collector', text: 'The most exquisite fragrances I have ever experienced. Each scent tells a unique story that lingers beautifully throughout the day.', rating: 5, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { name: 'James Mitchell', role: 'Fashion Director', text: 'SK SCENTS redefines luxury. The attention to detail in every bottle is remarkable. My signature scent for life.', rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { name: 'Sophia Chen', role: 'Beauty Editor', text: 'A masterpiece of perfumery. The complexity of notes combined with elegant presentation makes this a true luxury brand.', rating: 5, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
      ]);
      console.log('Default testimonials seeded');
    }
  } catch (error) {
    console.error('Error seeding testimonials:', error.message);
  }
};

const getTestimonials = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { active: true };
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial, seedTestimonials };
