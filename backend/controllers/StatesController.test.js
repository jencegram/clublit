const { getAllStates } = require('./StatesController');
const State = require('../models/State');


jest.mock('../models/State', () => ({
  findAll: jest.fn(),
}));

describe('StatesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('getAllStates', () => {
    it('should fetch all states and return them', async () => {
      const mockStates = [{ name: 'California' }, { name: 'New York' }];
      State.findAll.mockResolvedValue(mockStates);

      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
      };

      await getAllStates(null, res);

      expect(State.findAll).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockStates);
    });

    it('should handle errors when fetching states fails', async () => {
      State.findAll.mockRejectedValue(new Error('Server error'));

      const res = {
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn(),
      };

      await getAllStates(null, res);

      expect(State.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });
});
