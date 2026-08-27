import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

interface TestOption {
  id: string;
  name: string;
}

function getSearchInput() {
  return screen.getByRole("combobox", { name: "Search" });
}

function renderOptionLabel(option: TestOption) {
  return <span>Option: {option.name}</span>;
}

describe("SearchBar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a combobox with the given placeholder", () => {
    render(
      <SearchBar<TestOption>
        value={null}
        onChange={vi.fn()}
        onSearch={vi.fn().mockResolvedValue([])}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
      />,
    );
    expect(getSearchInput()).toBeDefined();
    expect(screen.getByText("Search")).toBeDefined();
  });

  it("debounces typing and calls onSearch once with the trimmed term", async () => {
    const onSearch = vi.fn().mockResolvedValue([]);
    render(
      <SearchBar<TestOption>
        value={null}
        onChange={vi.fn()}
        onSearch={onSearch}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
      />,
    );

    const input = getSearchInput();
    fireEvent.change(input, { target: { value: "N" } });
    fireEvent.change(input, { target: { value: "Ne" } });
    fireEvent.change(input, { target: { value: "New" } });

    await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(1), {
      timeout: 1000,
    });
    expect(onSearch).toHaveBeenCalledWith("New");
  });

  it("does not call onSearch for blank input", async () => {
    const onSearch = vi.fn().mockResolvedValue([]);
    render(
      <SearchBar<TestOption>
        value={null}
        onChange={vi.fn()}
        onSearch={onSearch}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
      />,
    );

    fireEvent.change(getSearchInput(), { target: { value: "   " } });

    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("renders results using renderOptionLabel", async () => {
    const onSearch = vi.fn().mockResolvedValue([{ id: "1", name: "Alpha" }]);
    render(
      <SearchBar<TestOption>
        value={null}
        onChange={vi.fn()}
        onSearch={onSearch}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
      />,
    );

    fireEvent.change(getSearchInput(), { target: { value: "Alpha" } });

    await waitFor(
      () => expect(screen.getByText("Option: Alpha")).toBeDefined(),
      {
        timeout: 1000,
      },
    );
  });

  it("calls onChange and onSelect with the picked option when clicked", async () => {
    const option: TestOption = { id: "1", name: "Alpha" };
    const onSearch = vi.fn().mockResolvedValue([option]);
    const onChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <SearchBar<TestOption>
        value={null}
        onChange={onChange}
        onSearch={onSearch}
        onSelect={onSelect}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
      />,
    );

    fireEvent.change(getSearchInput(), { target: { value: "Alpha" } });

    const rendered = await waitFor(() => screen.getByText("Option: Alpha"), {
      timeout: 1000,
    });
    fireEvent.click(rendered);

    expect(onChange).toHaveBeenCalledWith(option);
    expect(onSelect).toHaveBeenCalledWith(option);
  });

  it("renders the controlled value's label", () => {
    render(
      <SearchBar<TestOption>
        value={{ id: "1", name: "Alpha" }}
        onChange={vi.fn()}
        onSearch={vi.fn().mockResolvedValue([])}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
      />,
    );

    expect(screen.getByText("Option: Alpha")).toBeDefined();
  });

  it("passes isDisabled through to the underlying select", () => {
    const { container } = render(
      <SearchBar<TestOption>
        value={null}
        onChange={vi.fn()}
        onSearch={vi.fn().mockResolvedValue([])}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
        isDisabled
      />,
    );

    expect(container.querySelector("input[disabled]")).not.toBeNull();
  });

  it("focuses the input on mount when autoFocus is set", () => {
    const { container } = render(
      <SearchBar<TestOption>
        value={null}
        onChange={vi.fn()}
        onSearch={vi.fn().mockResolvedValue([])}
        onSelect={vi.fn()}
        renderOptionLabel={renderOptionLabel}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
        placeholder="Search"
        autoFocus
      />,
    );

    expect(document.activeElement).toBe(container.querySelector("input"));
  });
});
