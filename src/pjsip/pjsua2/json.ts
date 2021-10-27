/**
 * Persistent document (file) with JSON format.
 */
import { ContainerNode } from "./persistant";

export interface JsonDocument {

  /**
   * Load this document from a file.
   *
   * @param filename    The file name.
   */
  loadFile (filename: string);

  /**
   * Load this document from string.
   *
   * @param input    The string.
   */
  loadString (input: string);

  /**
   * Write this document to a file.
   *
   * @param filename    The file name.
   */
  saveFile (filename: string);

  /**
   * Write this document to string.
   */
  saveString (): string;

  /**
   * Get the root container node for this document
   */
  getRootContainer (): ContainerNode;

  /**
   * An internal function to create JSON element.
   */
  allocElement (): pj_json_elem;

  /**
   * An internal function to get the pool.
   */
  getPool ();

  cp: pj_caching_pool;
  readonly rootNode: ContainerNode;
  readonly root: pj_json_elem;
  readonly pool;

  initRoot ();
}
