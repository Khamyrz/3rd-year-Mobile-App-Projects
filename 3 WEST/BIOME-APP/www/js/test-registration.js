// Test Registration Functionality
async function testRegistration() {
    console.group('Testing Registration Process');
    
    try {
        // 1. Test Form Validation
        console.log('1. Testing Form Validation...');
        const testData = {
            email: 'test.vendor@example.com',
            password: 'short', // Should fail
            confirmPassword: 'different', // Should fail
            fullName: 'Test Vendor',
            contactNumber: '123456', // Should fail
            address: '',  // Should fail
            role: 'vendor',
            businessType: '',  // Should fail for vendor
            stallNumber: '',   // Should fail for vendor
        };
        
        const formData = new FormData();
        Object.entries(testData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await validateForm(formData);
            console.error('❌ Validation should have failed');
        } catch (error) {
            console.log('✅ Form validation correctly failed:', error.message);
        }

        // 2. Test Image Validation
        console.log('\n2. Testing Image Validation...');
        const tooLargeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
        try {
            await validateImage(tooLargeFile, 'Profile');
            console.error('❌ Image validation should have failed');
        } catch (error) {
            console.log('✅ Image size validation correctly failed:', error.message);
        }

        // 3. Test Firebase Auth
        console.log('\n3. Testing Firebase Auth...');
        try {
            await auth.signOut(); // Clear any existing auth
            console.log('✅ Successfully signed out previous user');
        } catch (error) {
            console.log('No user was signed in');
        }

        // 4. Test Database Rules
        console.log('\n4. Testing Database Rules...');
        try {
            // Try to write to users collection without auth
            await db.collection('users').add({ test: true });
            console.error('❌ Should not allow write without auth');
        } catch (error) {
            console.log('✅ Database rules correctly prevented unauthorized write');
        }

        // 5. Test Storage Rules
        console.log('\n5. Testing Storage Rules...');
        try {
            // Try to upload to storage without auth
            const testRef = storage.ref('test/unauthorized.jpg');
            await testRef.putString('test');
            console.error('❌ Should not allow upload without auth');
        } catch (error) {
            console.log('✅ Storage rules correctly prevented unauthorized upload');
        }

        console.log('\n✅ All basic validation tests completed');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    
    console.groupEnd();
}

// Add test button to registration page
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.textContent = 'Run Tests';
    testButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
    `;
    testButton.onclick = testRegistration;
    document.body.appendChild(testButton);
}); 