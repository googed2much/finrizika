import styles from "./Modal.module.css";

interface modalInfo {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
function Modal({isOpen,onClose,children}:modalInfo){
    if(!isOpen) return null;
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.Modal} onClick={(e)=> e.stopPropagation()} >
                <button className={styles.closeBtn} onClick={onClose}>X</button>
            {children}
            </div>
        </div>
    );
}
export default Modal;

