/**
 * This is the abstract base class of objects that can be serialized to/from
 * persistent document.
 */
export interface PersistentObject {

}

/**
 * This a the abstract base class for a persistent document. A document
 * is created either by loading from a string or a file, or by constructing
 * it manually when writing data to it. The document then can be saved
 * to either string or to a file. A document contains one root ContainerNode
 * where all data are stored under.
 *
 * Document is read and written serially, hence the order of reading must be
 * the same as the order of writing. The PersistentDocument class provides
 * API to read and write to the root node, but for more flexible operations
 * application can use the ContainerNode methods instead. Indeed the read
 * and write API in PersistentDocument is just a shorthand which calls the
 * relevant methods in the ContainerNode. As a tip, normally application only
 * uses the readObject() and writeObject() methods declared here to read/write
 * top level objects, and use the macros that are explained in ContainerNode
 * documentation to read/write more detailed data.
 */
export interface PersistentDocument {

  /**
   * Load this document from a file.
   *
   * @param filename  The file name.
   */
  loadFile (filename: string);

  /**
   * Load this document from string.
   *
   * @param input  The string.
   */
  loadString (input: string);

  /**
   * Write this document to a file.
   *
   * @param filename  The file name.
   */
  saveFile (filename: string);

  /**
   * Write this document to string.
   *
   * @return    The string document.
   */
  saveString (): string;

  /**
   * Get the root container node for this document
   *
   * @return    The root node.
   */
  getRootContainer (): ContainerNode;

  /*
   * Shorthand functions for reading and writing from/to the root container
   */

  /**
   * Determine if there is unread element. If yes, then app can use one of
   * the readXxx() functions to read it.
   *
   * @return    True if there is.
   */
  hasUnread (): boolean;

  /**
   * Get the name of the next unread element. It will throw Error if there
   * is no more element to read.
   *
   * @return    The name of the next element .
   */
  unreadName (): string;

  /**
   * Read an integer value from the document and return the value.
   * This will throw Error if the current element is not a number.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readnumber (name: string): number;

  /**
   * Read a float value from the document and return the value.
   * This will throw Error if the current element is not a number.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readNumber (name: string): number;

  /**
   * Read a boolean value from the container and return the value.
   * This will throw Error if the current element is not a boolean.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readBool (name: string): boolean;

  /**
   * Read a string value from the container and return the value.
   * This will throw Error if the current element is not a string.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readString (name: string): string;

  /**
   * Read a string array from the container. This will throw Error
   * if the current element is not a string array. The read position
   * will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readStringVector (name: string): string[];

  /**
   * Read the specified object from the container. This is equal to
   * calling PersistentObject.readObject(ContainerNode);
   *
   * @param obj  The object to read.
   */
  readObject (obj: PersistentObject);

  /**
   * Read a container from the container. This will throw Error if the
   * current element is not an object. The read position will be advanced
   * to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    Container object.
   */
  readContainer (name: string): ContainerNode;

  /**
   * Read array container from the container. This will throw Error if the
   * current element is not an array. The read position will be advanced
   * to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    Container object.
   */
  readArray (name: string): ContainerNode;

  /**
   * Write a number value to the container.
   *
   * @param name  The name for the value in the container.
   * @param num  The value to be written.
   */
  writeNumber (name: string, num: number);

  /**
   * Write a number value to the container.
   *
   * @param name  The name for the value in the container.
   * @param num  The value to be written.
   */
  writenumber (name: string, num: number);

  /**
   * Write a boolean value to the container.
   *
   * @param name  The name for the value in the container.
   * @param value  The value to be written.
   */
  writeBool (name: string, value: boolean);

  /**
   * Write a string value to the container.
   *
   * @param name  The name for the value in the container.
   * @param value  The value to be written.
   */
  writeString (name: string, value: string);

  /**
   * Write string vector to the container.
   *
   * @param name  The name for the value in the container.
   * @param arr  The vector to be written.
   */
  writeStringVector (name: string, arr: string[]);

  /**
   * Write an object to the container. This is equal to calling
   * PersistentObject.writeObject(ContainerNode);
   *
   * @param obj  The object to be written
   */
  writeObject (obj: PersistentObject);

}

/**
 * Internal data for ContainerNode. See ContainerNode implementation notes
 * for more info.
 */
export interface container_node_numberernal_data {
  doc;
  /**< The document.  */
  data1;
  /**< Internal data 1  */
  data2;		/**< Internal data 2  */
}

/**
 * A container node is a placeholder for storing other data elements, which
 * could be boolean, number, string, array of strings, or another container.
 * Each data in the container is basically a name/value pair, with a type
 * internally associated with it so that written data can be read in the
 * correct type. Data is read and written serially, hence the order of
 * reading must be the same as the order of writing.
 *
 * Application can read data from it by using the various read methods, and
 * write data to it using the various write methods. Alternatively, it
 * may be more convenient to use the provided macros below to read and write
 * the data, because these macros set the name automatically:
 *  - NODE_READ_BOOL(node,item)
 *  - NODE_READ_UNSIGNED(node,item)
 *  - NODE_READ_INT(node,item)
 *  - NODE_READ_FLOAT(node,item)
 *  - NODE_READ_NUM_T(node,type,item)
 *  - NODE_READ_STRING(node,item)
 *  - NODE_READ_STRINGV(node,item)
 *  - NODE_READ_OBJ(node,item)
 *  - NODE_WRITE_BOOL(node,item)
 *  - NODE_WRITE_UNSIGNED(node,item)
 *  - NODE_WRITE_INT(node,item)
 *  - NODE_WRITE_FLOAT(node,item)
 *  - NODE_WRITE_NUM_T(node,type,item)
 *  - NODE_WRITE_STRING(node,item)
 *  - NODE_WRITE_STRINGV(node,item)
 *  - NODE_WRITE_OBJ(node,item)
 *
 * Implementation notes:
 *
 * The ContainerNode class is subclass-able, but not in the usual C++ way.
 * With the usual C++ inheritance, some methods will be made pure virtual
 * and must be implemented by the actual class. However, doing so will
 * require dynamic instantiation of the ContainerNode class, which means
 * we will need to pass around the class as pointer, for example as the
 * return value of readContainer() and writeNewContainer() methods. Then
 * we will need to establish who needs or how to delete these objects, or
 * use shared pointer mechanism, each of which is considered too inconvenient
 * or complicated for the purpose.
 *
 * So hence we use C style "inheritance", where the methods are declared in
 * container_node_op and the data in container_node_internal_data structures.
 * An implementation of ContainerNode class will need to set up these members
 * with values that makes sense to itself. The methods in container_node_op
 * contains the pointer to the actual implementation of the operation, which
 * would be specific according to the format of the document. The methods in
 * this ContainerNode class are just thin wrappers which call the
 * implementation in the container_node_op structure.
 *
 */
export interface ContainerNode {

  /**
   * Determine if there is unread element. If yes, then app can use one of
   * the readXxx() functions to read it.
   */
  hasUnread (): boolean;

  /**
   * Get the name of the next unread element.
   */
  unreadName (): string;

  /**
   * Read an integer value from the document and return the value.
   * This will throw Error if the current element is not a number.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readnumber (name: string): number;

  /**
   * Read a number value from the document and return the value.
   * This will throw Error if the current element is not a number.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readNumber (name: string): number;

  /**
   * Read a boolean value from the container and return the value.
   * This will throw Error if the current element is not a boolean.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readBool (name: string): boolean;

  /**
   * Read a string value from the container and return the value.
   * This will throw Error if the current element is not a string.
   * The read position will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readString (name: string): string;

  /**
   * Read a string array from the container. This will throw Error
   * if the current element is not a string array. The read position
   * will be advanced to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    The value.
   */
  readStringVector (name: string): string[];

  /**
   * Read the specified object from the container. This is equal to
   * calling PersistentObject.readObject(ContainerNode);
   *
   * @param obj  The object to read.
   */
  readObject (obj: PersistentObject);

  /**
   * Read a container from the container. This will throw Error if the
   * current element is not a container. The read position will be advanced
   * to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    Container object.
   */
  readContainer (name: string): ContainerNode;

  /**
   * Read array container from the container. This will throw Error if the
   * current element is not an array. The read position will be advanced
   * to the next element.
   *
   * @param name  If specified, then the function will check if the
   *      name of the next element matches the specified
   *      name and throw Error if it doesn't match.
   *
   * @return    Container object.
   */
  readArray (name: string): ContainerNode;

  /**
   * Write a number value to the container.
   *
   * @param name  The name for the value in the container.
   * @param num  The value to be written.
   */
  writeNumber (name: string, num: number);

  /**
   * Write a number value to the container.
   *
   * @param name  The name for the value in the container.
   * @param num  The value to be written.
   */
  writenumber (name: string, num: number);

  /**
   * Write a boolean value to the container.
   *
   * @param name  The name for the value in the container.
   * @param value  The value to be written.
   */
  writeBool (name: string, value: boolean);

  /**
   * Write a string value to the container.
   *
   * @param name  The name for the value in the container.
   * @param value  The value to be written.
   */
  writeString (name: string, value: string);

  /**
   * Write string vector to the container.
   *
   * @param name  The name for the value in the container.
   * @param arr  The vector to be written.
   */
  writeStringVector (name: string, arr: string[]);

  /**
   * Write an object to the container. This is equal to calling
   * PersistentObject.writeObject(ContainerNode);
   *
   * @param obj  The object to be written
   */
  writeObject (obj: PersistentObject);

  /**
   * Create and write an empty Object node that can be used as parent
   * for subsequent write operations.
   *
   * @param name  The name for the new container in the container.
   *
   * @return    A sub-container.
   */
  writeNewContainer (name: string): ContainerNode;

  /**
   * Create and write an empty array node that can be used as parent
   * for subsequent write operations.
   *
   * @param name  The name for the array.
   *
   * @return    A sub-container.
   */
  writeNewArray (name: string): ContainerNode;

  /* internal data */
  op: container_node_op;
  /**< Method table.  */
  data: container_node_numberernal_data;	/**< Internal data  */
}

/**
 * Pointer to actual ContainerNode implementation. See ContainerNode
 * implementation notes for more info.
 */
//! @cond Doxygen_Suppress
export interface container_node_op {
  hasUnread (ContainerNode): boolean;

  unreadName (ContainerNode): string;

  readNumber (ContainerNode, string): number;

  readBool (ContainerNode, string): boolean;

  readString (ContainerNode, string): string;

  readStringVector (ContainerNode, string): string[];

  readContainer (ContainerNode, string): ContainerNode;

  readArray (ContainerNode, string): ContainerNode;

  writeNumber (ContainerNode, name: string, num: number);

  writeBool (ContainerNode, name: string, value: boolean);

  writeString (ContainerNode, name: string, value: string);

  writeStringVector (ContainerNode, name: string, value: string[]);

  writeNewContainer (ContainerNode, name: string): ContainerNode;

  writeNewArray (ContainerNode, name: string): ContainerNode;

}
