import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { WeatherMap } from "../WeatherMap";
import { weatherService } from "../../service/index";

test("should be label Text", () => {
  const { getByLabelText } = render(<WeatherMap />);
  expect(getByLabelText("Kelvin")).not.toBeUndefined();
  expect(getByLabelText("Fahrenheit")).not.toBeUndefined();
  expect(getByLabelText("Celsius")).not.toBeUndefined();
});

jest.mock("../../service/index")

test("shuold add city", async () => {
  weatherService.getWeather.mockResolvedValueOnce("baku")
  const { getByText, getByPlaceholderText } = render(<WeatherMap />);
  fireEvent.change(getByPlaceholderText("Search city"), {
    target: { value: "baku" },
  });
  fireEvent.keyUp(getByPlaceholderText("Search city"), {
    key: "Enter",
    code: "Enter",
  });
  await waitFor(()=>{
    expect(getByText("Baku")).not.toBeUndefined();
  })
});
