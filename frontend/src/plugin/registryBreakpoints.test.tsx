/*
 * Copyright 2025 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import useMediaQuery from '@mui/material/useMediaQuery';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useLayoutBreakpoints } from './registry';

vi.mock('@mui/material/useMediaQuery', () => {
  return {
    default: vi.fn(),
  };
});

describe('useLayoutBreakpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return layout breakpoints matching standard MUI themes', () => {
    // Mock useMediaQuery to return true for the first call (which maps to isXs in our implementation)
    // and false for others, just to test the hook returns the object correctly.
    const mockUseMediaQuery = vi.mocked(useMediaQuery);
    mockUseMediaQuery.mockImplementation((query: any) => {
      if (query.includes('only screen and (max-width:599.95px)')) return true; // down('sm')
      if (query.includes('only screen and (max-width:899.95px)')) return false; // down('md')
      return false;
    });

    const { result } = renderHook(() => useLayoutBreakpoints());

    expect(result.current).toHaveProperty('isXs');
    expect(result.current).toHaveProperty('isSm');
    expect(result.current).toHaveProperty('isMd');
    expect(result.current).toHaveProperty('isLg');
    expect(result.current).toHaveProperty('isXl');
    expect(result.current).toHaveProperty('isMobile');
    expect(result.current).toHaveProperty('isTablet');
    expect(result.current).toHaveProperty('isDesktop');
  });

  it('should correctly call useMediaQuery with MUI theme breakpoints', () => {
    const mockUseMediaQuery = vi.mocked(useMediaQuery);
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useLayoutBreakpoints());

    expect(mockUseMediaQuery).toHaveBeenCalledTimes(8);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(true);
  });
});
