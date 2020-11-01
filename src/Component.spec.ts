import pkg from "../package.json";
import Component from "./Component.js";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

describe("afix-range-slider", () => {

  const screenshotOptions = {
    noColors: true,
    customSnapshotIdentifier: ({
      defaultIdentifier,
    }: {
      defaultIdentifier: string;
    }) => `${browserName}-${defaultIdentifier}`,
  };

  beforeEach(async () => {
    await page.goto("http://localhost:8833/standalone.html");
  });

  it("registers a component named the same as that package's name", () => {
    expect(customElements.get(pkg.name)).toBe(Component);
  });

  it("supports setting width and height via CSS", async () => {
    await page.$eval("afix-range-slider", (el) => {
      el.style.width = "1234px";
      el.style.height = "432px";
    });

    const value = await(await page.$("afix-range-slider"))?.boundingBox();

    expect(value?.width).toBeCloseTo(1234);
    expect(value?.height).toBeCloseTo(432);
  });

  it("instance value is reflected in value attribute", async () => {
    await page.$eval("afix-range-slider", (el) => {
      (el as HTMLInputElement).value = "25";
    });

    const value = await(await page.$("afix-range-slider"))?.getAttribute('value');

    expect(value).toBe("25");
  });

  it("instance value attribute reflects attribute", async () => {
    await page.$eval("afix-range-slider", (el) => {
      el.setAttribute("value", "75");
    });
    const value = await page.$eval(
      "afix-range-slider",
      (el) => (el as HTMLInputElement).value
    );
    expect(value).toBe(75);
  });

  it("supports line mode", async () => {
    const sliderEl = await page.$('afix-range-slider')

    page.$eval("afix-range-slider", (el) => {
      el.setAttribute("line-style", "");
    });

    expect(sliderEl).toBeTruthy()

    expect(await sliderEl!.screenshot()).toMatchImageSnapshot(
      screenshotOptions
    );
  })

  it("supports horizontal", async () => {
    const sliderEl = await page.$("afix-range-slider");

    page.$eval("afix-range-slider", (el) => {
      el.setAttribute("horizontal", "");
    });

    expect(sliderEl).toBeTruthy();

    expect(await sliderEl!.screenshot()).toMatchImageSnapshot(
      screenshotOptions
    );
  });
});
