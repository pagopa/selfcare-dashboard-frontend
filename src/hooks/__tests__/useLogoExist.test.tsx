/* eslint-disable functional/no-let, functional/immutable-data */
import { act, renderHook } from '@testing-library/react';
import { useLogoExists } from '../useLogoExist';

class FakeImage {
  static instances: Array<FakeImage> = [];
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  constructor() {
    FakeImage.instances.push(this);
  }
}

beforeEach(() => {
  FakeImage.instances = [];
  vi.stubGlobal('Image', FakeImage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useLogoExists', () => {
  test('returns false when no url is provided', () => {
    const { result } = renderHook(() => useLogoExists(undefined));
    expect(result.current).toBe(false);
    expect(FakeImage.instances).toHaveLength(0);
  });

  test('returns null while loading and true once the image loads', () => {
    const { result } = renderHook(() => useLogoExists('https://logo/ok.png'));
    expect(result.current).toBeNull();
    expect(FakeImage.instances[0].src).toBe('https://logo/ok.png');

    act(() => FakeImage.instances[0].onload?.());
    expect(result.current).toBe(true);
  });

  test('returns false when the image fails to load and cleans up handlers on unmount', () => {
    const { result, unmount } = renderHook(() => useLogoExists('https://logo/ko.png'));

    act(() => FakeImage.instances[0].onerror?.());
    expect(result.current).toBe(false);

    unmount();
    expect(FakeImage.instances[0].onload).toBeNull();
    expect(FakeImage.instances[0].onerror).toBeNull();
  });
});
