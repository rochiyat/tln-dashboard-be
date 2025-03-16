import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  username = "User",
  verificationLink = "https://example.com/verify",
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to complete your registration</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <Section className="bg-indigo-600 px-6 py-8">
              <Heading className="text-white text-2xl font-bold text-center">
                Verify your email address
              </Heading>
            </Section>
            <Section className="px-6 py-8">
              <Text className="text-gray-700 text-base mb-4">
                Hello {username},
              </Text>
              <Text className="text-gray-700 text-base mb-6">
                Thank you for signing up! Please verify your email address by
                clicking the button below:
              </Text>
              <Section className="text-center mb-6">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded"
                  href={verificationLink}
                >
                  Verify Email
                </Button>
              </Section>
              <Text className="text-gray-700 text-sm mb-2">
                Or copy and paste this link in your browser:
              </Text>
              <Text className="text-indigo-600 text-sm mb-6 break-all">
                <Link
                  href={verificationLink}
                  className="text-indigo-600 underline"
                >
                  {verificationLink}
                </Link>
              </Text>
              <Hr className="border-t border-gray-300 my-6" />
              <Text className="text-gray-500 text-xs italic">
                If you didn't sign up for an account, you can ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
