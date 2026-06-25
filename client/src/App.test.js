import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock Firebase so tests don't need a real connection
jest.mock("./firebase", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  push: jest.fn(() => Promise.resolve()),
  onValue: jest.fn((ref, callback) => {
    callback({ val: () => null });
    return jest.fn();
  }),
  serverTimestamp: jest.fn(() => 0),
  update: jest.fn(() => Promise.resolve()),
}));

describe("CBC Conversations App", () => {

  test("1. renders the CBC header", () => {
    render(<App />);
    expect(screen.getByText("CBC Conversations")).toBeInTheDocument();
  });

  test("2. renders the post composer with name and textarea", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's on your mind about CBC content?")).toBeInTheDocument();
  });

  test("3. language toggle switches to French", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: /toggle language/i });
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText("Votre nom")).toBeInTheDocument();
  });

  test("4. language toggle switches back to English", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: /toggle language/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
  });

  test("5. shows empty state message when no posts", () => {
    render(<App />);
    expect(screen.getByText("No posts yet. Start the conversation!")).toBeInTheDocument();
  });

});
