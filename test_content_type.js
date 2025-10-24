const FormData = require('form-data');
const fs = require('fs');

async function testContentType() {
  try {
    console.log('🧪 Testing Content-Type for registration API...');
    
    // Create a test FormData
    const formData = new FormData();
    formData.append('firstName', 'Test');
    formData.append('lastName', 'User');
    formData.append('email', 'test@example.com');
    formData.append('phone', '+256123456789');
    formData.append('institution', 'Test University');
    formData.append('position', 'Student');
    formData.append('country', 'Uganda');
    formData.append('city', 'Kampala');
    formData.append('registrationType', 'local');
    
    // Create dummy files for testing
    const paymentProof = Buffer.from('dummy payment proof content');
    const passportPhoto = Buffer.from('dummy passport photo content');
    
    formData.append('paymentProof', paymentProof, {
      filename: 'payment.pdf',
      contentType: 'application/pdf'
    });
    
    formData.append('passportPhoto', passportPhoto, {
      filename: 'passport.jpg',
      contentType: 'image/jpeg'
    });
    
    console.log('📋 FormData created with fields:');
    console.log('   - firstName: Test');
    console.log('   - lastName: User');
    console.log('   - email: test@example.com');
    console.log('   - phone: +256123456789');
    console.log('   - institution: Test University');
    console.log('   - position: Student');
    console.log('   - country: Uganda');
    console.log('   - city: Kampala');
    console.log('   - registrationType: local');
    console.log('   - paymentProof: dummy file');
    console.log('   - passportPhoto: dummy file');
    
    console.log('\n📡 Content-Type header:', formData.getHeaders()['content-type']);
    
    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/registrations', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    console.log('\n📊 Response Status:', response.status);
    
    const result = await response.json();
    console.log('📄 Response Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Registration API test successful!');
    } else {
      console.log('❌ Registration API test failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testContentType();
