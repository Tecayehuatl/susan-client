import { GetOrderStatusPipe } from './get-order-status.pipe';

describe('GetOrderStatusPipe', () => {
    it('create an instance', () => {
        const pipe = new GetOrderStatusPipe();
        expect(pipe).toBeTruthy();
    });
});
