import mockAxios from 'jest-mock-axios';
import { getHeaders } from '../../src/index';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('GetHeaders', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data', async () => {
      // Given
      const gridResponse = {
        name: 'Test Grid.grid',
        description: null,
        columns: [
          {
              columnName: 'String Column',
              columnDesc: '',
              dataType: 'String',
              columnIndex: '0',
              islinkedColumn: false,
              isPrimaryLink: false
          },
          {
              columnName: 'Number Column',
              columnDesc: '',
              dataType: 'Number',
              columnIndex: '1',
              islinkedColumn: false,
              isPrimaryLink: false
          },
          {
              columnName: 'Number 2 Column',
              columnDesc: '',
              dataType: 'Number',
              columnIndex: '2',
              islinkedColumn: false,
              isPrimaryLink: false
          },
          {
              columnName: 'Boolean Column',
              columnDesc: '',
              dataType: 'Boolean',
              columnIndex: '3',
              islinkedColumn: false,
              isPrimaryLink: false
          },
          {
              columnName: 'Date Column',
              columnDesc: '',
              dataType: 'String',
              columnIndex: '4',
              islinkedColumn: false,
              isPrimaryLink: false
          },
          {
            columnName: 'Linked Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '5',
            islinkedColumn: true,
            isPrimaryLink: true,
            linkedColumnInfo: {
              sourceGridId: '6244901dc9d0823617041966',
              destinationGridId: '62448f82c9d0822ec669f83b',
              sourceColumnName: 'Source Column',
              destinationColumnName: 'Linked Column',
              queryInSourceGrid: null,
              linkedRelatedColumns: [
                {
                  'destColName': 'Linked Related Column From Other Grid',
                  'srcColName': 'Linked Related Column'
                }
              ]
            }
          },
          {
              columnName: 'Linked Related Column From Other Grid',
              columnDesc: '',
              dataType: 'STRING',
              columnIndex: '6',
              islinkedColumn: true,
              isPrimaryLink: false,
              srcColName: 'Linked Related Column'
          },
          {
            columnName: 'Formula Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '7',
            columnDataSource: {
              functionType: 'SUM',
              columnNames: [
                'Number Column',
                'Number 2 Column'
              ]
            },
            'islinkedColumn': false,
            'isPrimaryLink': false
          }
        ],
        sort: {},
        sortByIndex: {},
        sortArray: [],
        sortByIndexArray: [],
        fileId: '62448f7ec9d0822ec669f834',
        fileExtension: 'csv',
        fileSource: null,
        imageInfo: null,
        gridType: 'USER',
        defaultSyncPref: null,
        saveType: null,
        lastExtSrcSyncDateTime: null,
        auditGridId: '62448f82c9d0822ec669f83a',
        originalGridId: null,
        lastUpdatedTimeInBigParser: 1648661234129,
        lastUpdatedBy: 'Jonathan Keegan',
        defaultSaveFilter: null,
        filters: {
          isRecent: true,
          isFavorite: null,
          lastVisitedDateTime: 1648661217889,
          lastFavoriteDateTime: null,
          deletedDateTime: null,
          deletedBy: null
        },
        tabDescription: null,
        tabName: 'Test Tab',
        showRowId: false,
        owner: true,
        multisheet: true,
        auditGrid: false
      }

      // When
      const searchPromise = getHeaders(TEST_GRID_ID);
      mockAxios.mockResponse({ data: gridResponse });
      const { data: searchData, error: searchError } = await searchPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_metadata`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(searchError).toEqual(undefined);
      expect(searchData).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = getHeaders('');
      mockAxios.mockError(errorObject);
      const { data: searchData, error: searchError } = await searchPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid//query_metadata',
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(searchData).toEqual(undefined);
      expect(searchError).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const searchPromise = getHeaders(
        TEST_GRID_ID,
        '',
        'INVALID_AUTHID'
      );
      mockAxios.mockError(errorObject);
      const { data: searchData, error: searchError } = await searchPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_metadata`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(searchData).toEqual(undefined);
      expect(searchError).toEqual(errorObject);
    });
  });
});
