/**
 * Cấu hình môi trường phát triển
 * Script này thiết lập các cài đặt cho môi trường phát triển, bật tất cả các tính năng
 */
require('dotenv').config();
const { db } = require('./server/db');
const { 
  featureFlags, 
  systemSettings, 
  trainingModules 
} = require('./shared/schema');

/**
 * Bật tất cả tính năng trong môi trường phát triển
 */
async function enableAllFeatures() {
  try {
    console.log('Đang bật tất cả tính năng cho môi trường phát triển...');
    
    // Danh sách các tính năng cần bật trong môi trường phát triển
    const devFeatures = [
      { name: 'risk_assessment', enabled: true },
      { name: 'system_registration', enabled: true },
      { name: 'training_modules', enabled: true },
      { name: 'expert_reviews', enabled: true },
      { name: 'knowledge_center', enabled: true },
      { name: 'regulatory_updates', enabled: true },
      { name: 'document_templates', enabled: true },
      { name: 'ai_autofill', enabled: true },
      { name: 'multilingual_support', enabled: true },
      { name: 'interactive_scenarios', enabled: true },
      { name: 'enterprise_dashboard', enabled: true },
      { name: 'strategic_planning', enabled: true },
      { name: 'literacy_modules', enabled: true }
    ];
    
    // Thiết lập tất cả các cờ tính năng
    for (const feature of devFeatures) {
      console.log(`Đang bật tính năng: ${feature.name}`);
      
      // Kiểm tra nếu tính năng đã tồn tại
      const existingFeature = await db.select()
        .from(featureFlags)
        .where(featureFlags.name === feature.name);
      
      if (existingFeature && existingFeature.length > 0) {
        // Cập nhật tính năng hiện có
        await db.update(featureFlags)
          .set({ enabled: feature.enabled, updated_at: new Date() })
          .where(featureFlags.name === feature.name);
      } else {
        // Tạo tính năng mới
        await db.insert(featureFlags).values({
          name: feature.name,
          enabled: feature.enabled,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    // Thiết lập cài đặt hệ thống
    const devSettings = [
      { name: 'development_mode', value: 'true' },
      { name: 'display_all_features', value: 'true' },
      { name: 'enable_demo_accounts', value: 'true' },
      { name: 'show_experimental', value: 'true' }
    ];

    for (const setting of devSettings) {
      console.log(`Đang thiết lập cài đặt: ${setting.name} = ${setting.value}`);
      
      // Kiểm tra nếu cài đặt đã tồn tại
      const existingSetting = await db.select()
        .from(systemSettings)
        .where(systemSettings.name === setting.name);
      
      if (existingSetting && existingSetting.length > 0) {
        // Cập nhật cài đặt hiện có
        await db.update(systemSettings)
          .set({ value: setting.value, updated_at: new Date() })
          .where(systemSettings.name === setting.name);
      } else {
        // Tạo cài đặt mới
        await db.insert(systemSettings).values({
          name: setting.name,
          value: setting.value,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
    
    console.log('Thiết lập môi trường phát triển hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi thiết lập môi trường phát triển:', error);
  } finally {
    process.exit(0);
  }
}

// Chạy script
enableAllFeatures();