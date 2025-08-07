
import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const CustomerSuggestion = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .trim()
      .slice(0, 5000); // Enforce length limit
  };

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedMessage = sanitizeInput(formData.message);
    const sanitizedName = sanitizeInput(formData.name);
    const sanitizedEmail = sanitizeInput(formData.email);

    if (!sanitizedMessage) {
      toast("Please enter a message", {
        description: "The message field is required.",
      });
      return;
    }

    if (sanitizedMessage.length < 10) {
      toast("Message too short", {
        description: "Please provide at least 10 characters for your suggestion.",
      });
      return;
    }

    if (sanitizedEmail && !isValidEmail(sanitizedEmail)) {
      toast("Invalid email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('suggestions')
        .insert({
          name: sanitizedName || null,
          email: sanitizedEmail || null,
          message: sanitizedMessage
        });

      if (error) {
        throw error;
      }

      toast("Thank you for your suggestion!", {
        description: "We appreciate your feedback and will review it soon. Your privacy is important to us.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast("Failed to submit suggestion", {
        description: "Please try again later or contact support if the problem persists.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply length limits during input
    let sanitizedValue = value;
    if (name === 'message') {
      sanitizedValue = value.slice(0, 5000);
    } else if (name === 'name' || name === 'email') {
      sanitizedValue = value.slice(0, 255);
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  return (
    <section className="py-16 px-4 bg-gray-800/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-blue-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Share Your Ideas
            </h2>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Help us improve PDF Tools Pro! Share your suggestions, feature requests, or feedback with us.
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Customer Suggestion</CardTitle>
            <CardDescription className="text-gray-400">
              Your input helps us build better tools for everyone. We respect your privacy and will only use your information to improve our services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name (optional)
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={255}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email (optional)
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    maxLength={255}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Suggestion * (minimum 10 characters)
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  maxLength={5000}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
                  placeholder="Please share your detailed suggestion, feature request, or feedback here..."
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {formData.message.length}/5000 characters
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || formData.message.length < 10}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Suggestion
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you acknowledge that we may store your feedback to improve our services. 
                We do not share your personal information with third parties.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerSuggestion;
