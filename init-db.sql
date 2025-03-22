-- Insert departments if they don't exist
INSERT INTO departments (name, compliance_score) 
VALUES 
('Engineering', 87),
('Marketing', 65),
('Human Resources', 92),
('Customer Service', 78),
('Finance', 56),
('Executive', 90),
('Information Technology', 95),
('Research & Development', 82)
ON CONFLICT (name) DO NOTHING;

-- Insert admin user if it doesn't exist
INSERT INTO users (uid, username, email, password, display_name, role, department)
VALUES ('admin-01', 'admin', 'admin@sghasia.com', 'password123', 'Admin User', 'admin', 'Executive')
ON CONFLICT (uid) DO NOTHING;

-- Insert sample AI system if none exist
INSERT INTO ai_systems (system_id, name, department, risk_level, risk_score, description, created_by)
VALUES 
('SGH-AI-001', 'Customer Service Chatbot', 'Customer Service', 'Limited Risk', 35, 'AI-powered chatbot for handling customer inquiries', 'admin-01'),
('SGH-AI-002', 'Predictive Maintenance System', 'Engineering', 'High Risk', 75, 'AI system that predicts equipment failures', 'admin-01'),
('SGH-AI-003', 'HR Candidate Screening Tool', 'Human Resources', 'High Risk', 65, 'AI tool for initial screening of job applicants', 'admin-01')
ON CONFLICT (system_id) DO NOTHING;

-- Insert sample activities
INSERT INTO activities (type, description, user_id, system_id, timestamp)
VALUES 
('system_register', 'Registered new AI system', 'admin-01', 'SGH-AI-001', NOW() - INTERVAL '5 days'),
('risk_assessment', 'Completed risk assessment', 'admin-01', 'SGH-AI-002', NOW() - INTERVAL '3 days'),
('documentation', 'Updated technical documentation', 'admin-01', 'SGH-AI-003', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (type, severity, title, description, system_id, created_at)
VALUES 
('compliance', 'Critical', 'Documentation Gap', 'Technical documentation is incomplete', 'SGH-AI-002', NOW() - INTERVAL '2 days'),
('security', 'Critical', 'Potential Data Leakage', 'System may expose sensitive data', 'SGH-AI-003', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample deadlines
INSERT INTO deadlines (title, description, date, type, related_system_id)
VALUES 
('Technical Documentation', 'Complete technical documentation for EU AI Act compliance', NOW() + INTERVAL '10 days', 'compliance', 'SGH-AI-001'),
('Risk Assessment Update', 'Update risk assessment following new model deployment', NOW() + INTERVAL '15 days', 'assessment', 'SGH-AI-002'),
('Compliance Certification', 'Submit for EU AI Act compliance certification', NOW() + INTERVAL '30 days', 'certification', 'SGH-AI-003')
ON CONFLICT DO NOTHING;