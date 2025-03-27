/**
 * Script thiết lập môi trường phát triển nhanh chóng
 * Chạy script này để tự động hóa việc khởi tạo môi trường phát triển đầy đủ
 */
const { exec } = require('child_process');

// Các lệnh cần chạy
const commands = [
  'node check-db.js',                 // Kiểm tra kết nối cơ sở dữ liệu
  'npx tsx init-db.ts',               // Khởi tạo cơ sở dữ liệu
  'node create-demo-users.js',        // Tạo người dùng demo
  'node seed-training-modules.js',    // Thêm dữ liệu mô-đun đào tạo
  'node development-config.js'        // Bật tất cả tính năng cho môi trường phát triển
];

// Chạy các lệnh theo trình tự
async function setupDevelopment() {
  try {
    console.log('=== BẮT ĐẦU THIẾT LẬP MÔI TRƯỜNG PHÁT TRIỂN ===');
    
    for (const command of commands) {
      console.log(`\nĐang chạy: ${command}`);
      await executeCommand(command);
    }
    
    console.log('\n=== THIẾT LẬP MÔI TRƯỜNG PHÁT TRIỂN HOÀN TẤT ===');
    console.log('Bây giờ bạn có thể khởi động ứng dụng với lệnh:');
    console.log('npm run dev');
    console.log('\nVà sử dụng một trong các tài khoản demo:');
    console.log('- Admin: admin@demo.com / Admin123!');
    console.log('- Technical: technical@demo.com / Technical123!');
    console.log('- Legal: legal@demo.com / Legal123!');
    console.log('- Decision Maker: decision@demo.com / Decision123!');
    console.log('- Operator: operator@demo.com / Operator123!');
    
  } catch (error) {
    console.error('Thiết lập môi trường phát triển thất bại:', error);
    process.exit(1);
  }
}

// Thực thi lệnh và trả về promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Lỗi khi thực thi lệnh: ${command}`);
        console.error(error);
        return reject(error);
      }
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      resolve();
    });
  });
}

// Chạy thiết lập
setupDevelopment();