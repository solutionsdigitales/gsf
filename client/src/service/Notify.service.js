export default class NotifyService {
    
    static success(obj, title, description) {
        const msg = description || 'FORM.INFO.OPERATION_SUCCESS';
        obj.$toast.add({
            severity: "success",
            summary: obj.$t(title || ''),
            detail: obj.$t(msg),
            life: 4000,
        });
    }

    static danger(obj, title, description) {
        const msg = description || 'FORM.INFO.OPERATION_FAILED';
        obj.$toast.add({
            severity: "error",
            summary: obj.$t(title || ''),
            detail: obj.$t(msg),
            life:4000,
        });
    }
}