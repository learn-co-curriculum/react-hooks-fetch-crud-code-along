import "whatwg-fetch";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { resetData } from "../mocks/handlers";
import { server } from "../mocks/server";
import ShoppingList from "../components/ShoppingList";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetData();
});
afterAll(() => server.close());

test("displays all the items from the server after the initial render", async () => {
  render(<ShoppingList />);

  const yogurt = await screen.findByText(/Yogurt/);
  expect(yogurt).toBeInTheDocument();

  const pomegranate = await screen.findByText(/Pomegranate/);
  expect(pomegranate).toBeInTheDocument();

  const lettuce = await screen.findByText(/Lettuce/);
  expect(lettuce).toBeInTheDocument();
});

test("adds a new item to the list when the ItemForm is submitted", async () => {
  const { rerender } = render(<ShoppingList />);

  const dessertCount = screen.queryAllByText(/Dessert/).length;

  fireEvent.change(screen.queryByLabelText(/Name/), {
    target: { value: "Ice Cream" },
  });

  fireEvent.change(screen.queryByLabelText(/Category/), {
    target: { value: "Dessert" },
  });

  fireEvent.submit(screen.queryByText(/Add to List/));

  const iceCream = await screen.findByText(/Ice Cream/);
  expect(iceCream).toBeInTheDocument();

  const desserts = await screen.findAllByText(/Dessert/);
  expect(desserts.length).toBe(dessertCount + 1);

  // Rerender the component to ensure the item was persisted
  rerender(<ShoppingList />);

  const rerenderedIceCream = await screen.findByText(/Ice Cream/);
  expect(rerenderedIceCream).toBeInTheDocument();
});

test("updates the isInCart status of an item when the Add/Remove from Cart button is clicked", async () => {
  const { rerender } = render(<ShoppingList />);

  const addButtons = await screen.findAllByText(/Add to Cart/);

  expect(addButtons.length).toBe(3);
  expect(screen.queryByText(/Remove From Cart/)).not.toBeInTheDocument();

  fireEvent.click(addButtons[0]);

  const removeButton = await screen.findByText(/Remove From Cart/);
  expect(removeButton).toBeInTheDocument();

  // Rerender the component to ensure the item was persisted
  rerender(<ShoppingList />);

  const rerenderedAddButtons = await screen.findAllByText(/Add to Cart/);
  const rerenderedRemoveButtons = await screen.findAllByText(
    /Remove From Cart/
  );

  expect(rerenderedAddButtons.length).toBe(2);
  expect(rerenderedRemoveButtons.length).toBe(1);
});

test("removes an item from the list when the delete button is clicked", async () => {
  const { rerender } = render(<ShoppingList />);

  const yogurt = await screen.findByText(/Yogurt/);
  expect(yogurt).toBeInTheDocument();

  const deleteButtons = await screen.findAllByText(/Delete/);
  fireEvent.click(deleteButtons[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/Yogurt/));

  // Rerender the component to ensure the item was persisted
  rerender(<ShoppingList />);

  const rerenderedDeleteButtons = await screen.findAllByText(/Delete/);

  expect(rerenderedDeleteButtons.length).toBe(2);
  expect(screen.queryByText(/Yogurt/)).not.toBeInTheDocument();
});
