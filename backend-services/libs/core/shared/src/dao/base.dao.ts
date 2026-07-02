import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm'

/**
 * Generic data-access base class shared by every backend service.
 *
 * Centralises the regular CRUD plumbing (create, find, count, update, delete) so that
 * concrete DAOs only implement the entity↔domain mapping and any complex queries.
 *
 * @typeParam TEntity - the TypeORM entity persisted by the repository.
 * @typeParam TDomain - the domain model returned to services. Defaults to TEntity for
 *                      DAOs that expose entities directly (no mapping layer).
 */
export abstract class BaseDao<TEntity extends ObjectLiteral, TDomain = TEntity> {
  protected constructor(protected readonly repository: Repository<TEntity>) {}

  /**
   * Maps a persisted entity to the domain model returned by the DAO.
   * Defaults to an identity cast; override when the DAO has a dedicated domain model.
   */
  protected toDomainModel(entity: TEntity): TDomain {
    return entity as unknown as TDomain
  }

  /**
   * Maps a domain model to a partial entity for persistence. The default strips any
   * `undefined` fields (via {@link pruneUndefined}) so absent values never overwrite
   * columns; override when the DAO needs to whitelist or transform specific fields.
   */
  protected toEntity(model: TDomain): Partial<TEntity> {
    return this.pruneUndefined(model as unknown as Partial<TEntity>)
  }

  /**
   * Returns a shallow copy of the given object with all `undefined` values removed,
   * so that absent fields never overwrite existing columns on save/update.
   */
  protected pruneUndefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
    ) as Partial<T>
  }

  /** Creates and persists a new record from the given domain model. */
  protected async createOne(model: TDomain): Promise<TDomain> {
    const entity = this.repository.create(this.toEntity(model) as TEntity)
    const saved = await this.repository.save(entity)
    return this.toDomainModel(saved)
  }

  /** Persists changes to an existing record (full save) and returns the result. */
  protected async saveOne(model: TDomain): Promise<TDomain> {
    const saved = await this.repository.save(this.toEntity(model) as TEntity)
    return this.toDomainModel(saved)
  }

  /** Finds a single record by primary id. */
  protected async findById(id: string): Promise<TDomain | null> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    })
    return entity ? this.toDomainModel(entity) : null
  }

  /** Finds the first record matching the given criteria, optionally ordered. */
  protected async findOneBy(
    where: FindOptionsWhere<TEntity>,
    order?: FindOptionsOrder<TEntity>,
  ): Promise<TDomain | null> {
    const entity = await this.repository.findOne({ where, order })
    return entity ? this.toDomainModel(entity) : null
  }

  /** Finds all records matching the given criteria, optionally ordered. */
  protected async findManyBy(
    where?: FindOptionsWhere<TEntity>,
    order?: FindOptionsOrder<TEntity>,
  ): Promise<TDomain[]> {
    const entities = await this.repository.find({ where: where ?? {}, order })
    return entities.map((e) => this.toDomainModel(e))
  }

  /**
   * Finds the first record using full TypeORM options (relations, select, …) and maps it.
   * Use for reads that need more than a where/order; otherwise prefer {@link findOneBy}.
   */
  protected async findOneWith(options: FindOneOptions<TEntity>): Promise<TDomain | null> {
    const entity = await this.repository.findOne(options)
    return entity ? this.toDomainModel(entity) : null
  }

  /**
   * Finds many records using full TypeORM options (pagination via take/skip, relations,
   * select, …) and maps them. Use for paginated or projected reads.
   */
  protected async findManyWith(options: FindManyOptions<TEntity>): Promise<TDomain[]> {
    const entities = await this.repository.find(options)
    return entities.map((e) => this.toDomainModel(e))
  }

  /** Counts records matching the given criteria. */
  protected async countBy(where?: FindOptionsWhere<TEntity>): Promise<number> {
    return this.repository.count({ where: where ?? {} })
  }

  /**
   * Updates the record with the given id and returns the refreshed, mapped record.
   * Throws (via `findOneOrFail`) if the row no longer exists after the update.
   */
  protected async updateAndFetchById(
    id: string,
    patch: Parameters<Repository<TEntity>['update']>[1],
  ): Promise<TDomain> {
    await this.repository.update(id, patch)
    const entity = await this.repository.findOneOrFail({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    })
    return this.toDomainModel(entity)
  }

  /** Deletes the record(s) matching the given id or criteria. Returns rows affected. */
  protected async deleteBy(
    criteria: Parameters<Repository<TEntity>['delete']>[0],
  ): Promise<number> {
    const result = await this.repository.delete(criteria)
    return result.affected ?? 0
  }
}
