-- Enable leaked password protection for better security
UPDATE auth.config 
SET leaked_password_protection = true
WHERE parameter = 'leaked_password_protection';