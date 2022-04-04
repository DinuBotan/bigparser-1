import mockAxios from 'jest-mock-axios';
import { search } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('Search', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data (prod)', async () => {
      // Given
      const gridData = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      const queryObject = {
        query: {
          sendRowIdsInResponse: true,
          showColumnNamesInResponse: true,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridData,
      });
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridData);
    });
    it('Should Return Grid Data (qa)', async () => {
      // Given
      const gridData = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      const queryObject = {
        query: {
          sendRowIdsInResponse: true,
          showColumnNamesInResponse: true,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        qa: true,
      });
      mockAxios.mockResponse({
        data: gridData,
      });
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://qa.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridData);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const queryObject = {
        query: {
          sendRowIdsInResponse: true,
          showColumnNamesInResponse: true,
        },
      };
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, 'INVALID_GRID_ID');
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid/INVALID_GRID_ID/search',
        queryObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
      const queryObject = {
        query: {
          sendRowIdsInResponse: true,
          showColumnNamesInResponse: true,
        },
      };
      const errorObject = {
        err: {
          message: 'Invalid View Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        viewId: 'INVALID_VIEW_ID',
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/share/INVALID_VIEW_ID/search`,
        queryObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const queryObject = {
        query: {
          sendRowIdsInResponse: true,
          showColumnNamesInResponse: true,
        },
      };
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});
