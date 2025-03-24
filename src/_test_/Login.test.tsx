import  {Login}  from "../components/Login";

global.fetch = jest.fn();

describe("Login Function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test("should successfully logged in  with valid credentials",  () => {
    const mockResponse = { token: "auth-token" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result =  Login();

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("https://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "username", password: "password1" }),
    });
  });

  test("should throw an error if credentials are incorrect", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(Login()).rejects.toThrow(
      "Invalid username or password"
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if fetch fails (network error)", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(Login()).rejects.toThrow(
      "Network error"
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
