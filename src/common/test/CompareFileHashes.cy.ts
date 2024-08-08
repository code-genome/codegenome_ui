import { compareFileHashes } from "@/common/CompareFileHashes";

describe('compareFileHashes', () => {
    it('should call compareFileHashes', () => {
        const accessToken = 'accessToken';
        const dispatch = () => {};
        const hash1 = 'hash1';
        const hash2 = 'hash2';
        const start_ts = 123456789;
        compareFileHashes(accessToken, dispatch, hash1, hash2, start_ts);
    });
});
