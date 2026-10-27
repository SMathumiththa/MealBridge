const mongoose = require('mongoose');
const User = require('./models/User');
const Food = require('./models/Food');
const Request = require('./models/Request');
require('dotenv').config();

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodDonationDB');
    console.log('Connected to DB');

    // 1. Create Users
    const donor = await User.create({ name: 'Test Donor', email: 'donor@test.com', password: 'password', role: 'donor', status: 'active' });
    const ngo = await User.create({ name: 'Test NGO', email: 'ngo@test.com', password: 'password', role: 'ngo', status: 'active' });
    const volunteer = await User.create({ name: 'Test Vol', email: 'vol@test.com', password: 'password', role: 'volunteer', status: 'active' });
    
    console.log('Users created');

    // 2. Donor creates food
    const food = await Food.create({
      donor: donor._id,
      foodName: 'Test Apples',
      description: 'Fresh apples',
      foodType: 'veg',
      quantity: 10,
      originalQuantity: 10,
      location: { address: 'Donor Address' },
      expiryTime: new Date(Date.now() + 86400000), // tomorrow
      adminStatus: 'approved' // Simulate admin approval
    });
    console.log('Food created and approved');

    // 3. NGO requests food
    const request = await Request.create({
      foodId: food._id,
      ngoId: ngo._id,
      qty: 5,
      status: 'pending'
    });
    console.log('NGO requested food');

    // 4. Donor accepts request
    request.status = 'accepted';
    await request.save();
    console.log('Donor accepted request');

    // 5. Volunteer claims request (Simulate assignVolunteer)
    if (request.status === 'accepted' && !request.volunteerId) {
      request.volunteerId = volunteer._id;
      await request.save();
      console.log('Volunteer assigned');
    }

    // 6. Volunteer picks up
    request.status = 'picked_up';
    await request.save();
    console.log('Volunteer picked up food');

    // 7. Volunteer completes delivery (Simulate gamification)
    // Actually, gamification in the app runs in updateStatus controller, not on save hook.
    // Let's call the controller function directly, or duplicate the logic to verify the controller is right.
    // Wait, the controller handles it. Let's just use an HTTP request or mock req/res to test the controller logic.
    // It's easier to just mock req/res.
    const { updateStatus } = require('./controllers/requestController');
    const req = {
      params: { id: request._id },
      body: { status: 'completed' },
      user: { _id: volunteer._id, role: 'volunteer', name: volunteer.name },
      app: { get: () => null } // mock socket io
    };
    
    let resData;
    const res = {
      json: (data) => { resData = data; },
      status: (code) => ({ json: (data) => { resData = data; console.log("Error status:", code, data); } })
    };

    await updateStatus(req, res);
    console.log('Update status response:', resData);

    // 8. Verify points
    const updatedVol = await User.findById(volunteer._id);
    console.log(`Volunteer Points: ${updatedVol.points} (Expected: 50)`);
    console.log(`Volunteer Badge: ${updatedVol.badge} (Expected: Bronze)`);

    if (updatedVol.points === 50 && updatedVol.badge === 'Bronze') {
      console.log('SUCCESS: Volunteer flow works correctly.');
    } else {
      console.log('FAILED: Volunteer points or badge did not update correctly.');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Cleanup
    await User.deleteMany({ email: { $in: ['donor@test.com', 'ngo@test.com', 'vol@test.com'] } });
    await Food.deleteMany({ foodName: 'Test Apples' });
    if (typeof request !== 'undefined') await Request.deleteMany({ foodId: request._id });
    await mongoose.disconnect();
  }
}

runTest();
