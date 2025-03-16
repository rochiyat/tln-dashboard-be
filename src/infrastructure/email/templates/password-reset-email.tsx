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

interface PasswordResetEmailProps {
  username: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  username = "User",
  resetLink = "https://example.com/reset-password",
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <Section className="bg-blue-600 px-6 py-8">
              <Heading className="text-white text-2xl font-bold text-center">
                Reset Your Password
              </Heading>
            </Section>
            <Section className="px-6 py-8">
              <Text className="text-gray-700 text-base mb-4">
                Hello {username},
              </Text>
              <Text className="text-gray-700 text-base mb-6">
                We received a request to reset your password. Click the button
                below to create a new password:
              </Text>
              <Section className="text-center mb-6">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
                  href={resetLink}
                >
                  Reset Password
                </Button>
              </Section>
              <Text className="text-gray-700 text-sm mb-2">
                Or copy and paste this link in your browser:
              </Text>
              <Text className="text-blue-600 text-sm mb-6 break-all">
                <Link href={resetLink} className="text-blue-600 underline">
                  {resetLink}
                </Link>
              </Text>
              <Text className="text-gray-700 text-sm mb-6">
                This link is valid for 1 hour. If you didn't request a password
                reset, you can ignore this email.
              </Text>
              <Hr className="border-t border-gray-300 my-6" />
              <Text className="text-gray-500 text-xs italic">
                This email was sent to you because you requested a password
                reset for your account.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
