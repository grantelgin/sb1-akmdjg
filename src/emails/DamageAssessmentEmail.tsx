import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import { FormData } from '../components/Questionnaire/types';

interface EmailTemplateProps {
  formData: FormData;
  reportId: string;
}

export const DamageAssessmentEmail = ({
  formData,
  reportId,
}: EmailTemplateProps) => {
  const previewText = `Your Storm Damage Assessment Report (${reportId})`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={header}>
            Storm Damage Assessment Report
          </Heading>

          <Section style={section}>
            <Text style={text}>
              Dear {formData.firstName} {formData.lastName},
            </Text>
            <Text style={text}>
              Thank you for submitting your storm damage assessment. We've generated a detailed report 
              for your property at {formData.address}.
            </Text>

            <Section style={buttonContainer}>
              <Button
                href={`https://yourwebsite.com/report/${reportId}`}
                style={button}
              >
                View Full Report
              </Button>
            </Section>

            <Section style={summarySection}>
              <Heading as="h2" style={subheader}>
                Damage Assessment Summary
              </Heading>
              {Object.entries(formData.damageAssessment).map(([key, value]) => (
                <Text key={key} style={summaryItem}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}: 
                  <span style={getDamageLevelStyle(value)}>{value}</span>
                </Text>
              ))}
            </Section>

            <Text style={text}>
              A contractor from our network will contact you shortly to discuss repairs.
            </Text>

            <Text style={footer}>
              If you have any questions, please don't hesitate to contact us.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const header = {
  color: '#1e3a8a',
  fontSize: '24px',
  lineHeight: '1.25',
  padding: '0 48px',
  margin: '0 0 24px',
};

const section = {
  padding: '0 48px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const summarySection = {
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
};

const subheader = {
  color: '#1e3a8a',
  fontSize: '20px',
  margin: '0 0 16px',
};

const summaryItem = {
  ...text,
  margin: '8px 0',
};

const footer = {
  ...text,
  color: '#8898aa',
  fontSize: '14px',
  marginTop: '24px',
};

const getDamageLevelStyle = (level: string) => {
  const colors = {
    none: '#16a34a',
    minor: '#ca8a04',
    moderate: '#ea580c',
    severe: '#dc2626',
  };
  return {
    color: colors[level as keyof typeof colors],
    fontWeight: 600,
    marginLeft: '8px',
  };
};

export default DamageAssessmentEmail;
