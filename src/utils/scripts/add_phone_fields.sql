-- Add phone number and SMS consent fields to damage_reports table
ALTER TABLE damage_reports
ADD COLUMN phone_number text,
ADD COLUMN sms_consent boolean NOT NULL DEFAULT false; 